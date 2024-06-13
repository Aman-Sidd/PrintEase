import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
// import RazorpayCheckout from "react-native-razorpay";
// import {
//   RAZORPAY_API_KEY,
//   RAZORPAY_CURRENCY,
//   RAZORPAY_DESCRIPTION,
//   RAZORPAY_IMAGE_URL,
//   RAZORPAY_ORG_NAME,
//   RAZORPAY_PREFILL_CONTACT,
//   RAZORPAY_PREFILL_EMAIL,
//   RAZORPAY_PREFILL_NAME,
// } from "../../constants/RAZORPAY";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/utils/LoadingScreen";
import { updatePaymentId } from "../../api/methods/updatePaymentId";
import { getPerPagePrice } from "../../components/helpers/GetPerPagePrice";
import {
  RAZORPAY_API_KEY,
  RAZORPAY_CURRENCY,
  RAZORPAY_DESCRIPTION,
  RAZORPAY_IMAGE_URL,
  RAZORPAY_ORG_NAME,
  RAZORPAY_PREFILL_CONTACT,
  RAZORPAY_PREFILL_EMAIL,
  RAZORPAY_PREFILL_NAME,
} from "../../constants/RAZORPAY";
import { sendPushNotification } from "../../api/methods/sendPushNotification";
import { OWNER_USER_ID } from "../../constants/OwnerCredentials";
import { ScrollView } from "react-native-gesture-handler";

const CheckoutScreen = ({ navigation }) => {
  const orderDetails = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const fileObj = orderDetails.file;
  const createFileObject = (uri, name, type) => {
    if (Platform.OS === "web") {
      // For web, create a file object directly
      return fileObj;
    } else {
      // For React Native, use the existing approach
      return {
        uri,
        name,
        type,
      };
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    const formData = new FormData();

    const file = createFileObject(
      orderDetails.pdfUri,
      orderDetails.pdfName,
      "application/pdf"
    );
    formData.append("file", file);
    formData.append("title", orderDetails.pdfName);
    formData.append("totalprice", orderDetails.noOfPages * priceRatePerPage);
    formData.append("pagesize", orderDetails.pageSize);
    formData.append("color", orderDetails.color);
    formData.append("printtype", orderDetails.printType);
    formData.append("totalpages", orderDetails.noOfPages);
    formData.append("priceperpage", priceRatePerPage);
    formData.append("paymentid", 12345);
    formData.append(
      "spiralbinding",
      orderDetails.spiralBinding === "Yes" ? true : false
    );
    formData.append("shopid", orderDetails.shop.shop_id);

    try {
      const response = await myApi.post("/user/create-order", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response in checkoutscreen:", response.data);
      if (response.data.success === "true") {
        console.log(
          "OrderId from checkoutScrn:",
          response.data.data.orderDetails.order_id
        );
        return response.data.data.orderDetails.order_id;
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error while creating order:", err.response);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentInfo = async ({ orderid, paymentid }) => {
    try {
      setLoading(true);
      const response = await updatePaymentId({
        orderid,
        paymentid,
      });
      if (response.success === true)
        Alert.alert("Success!", "Order placed successfully.");
      else Alert.alert("Failed!", "Something went wrong");
    } catch (err) {
      console.log("Error in updating payment id:", err.response.data);
      Alert.alert("Failed!", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function handleCheckout(totalAmount) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }
    const order_id = await placeOrder();

    var options = {
      key: RAZORPAY_API_KEY, // Enter the Key ID generated from the Dashboard
      amount: totalAmount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: RAZORPAY_CURRENCY,
      name: RAZORPAY_ORG_NAME,
      description: RAZORPAY_DESCRIPTION,
      image: RAZORPAY_IMAGE_URL,
      order_id: "",
      prefill: {
        email: user?.data.email,
        contact: user?.data.phone,
        name: user?.data.username,
      }, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        // console.log("RESPONSE:", response);
        await updatePaymentInfo({
          orderid: order_id,
          paymentid: response.razorpay_payment_id,
        })
          .then((data) => {
            alert("Order Successful!");
          })
          .then(async () => {
            await sendPushNotification({
              user_id: OWNER_USER_ID,
              message: "New Order Has Been Received.",
            });
          })
          .catch((err) => {
            // alert("payment successfull but error in updating payment info!");
            console.log(err);
          });
      },
      prefill: {
        email: user?.data.email,
        contact: user?.data.phone,
        name: user?.data.username,
      },
      theme: {
        color: "#3399cc",
      },
    };

    if (order_id === null) {
      alert("Failed! Something went wrong.");
      return;
    }

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      alert(
        `Error occured while making payment: ${response.error.description}`
      );
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });
    paymentObject.open();
  }

  const priceRatePerPage = getPerPagePrice(orderDetails.noOfPages);

  const totalAmount = orderDetails.noOfPages * priceRatePerPage;

  const handleBackButton = () => {
    navigation.pop();
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <ScrollView style={styles.container}>
      <View style={styles.checkoutInfo}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Info</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Shop Name:</Text>
            <Text style={styles.value}>{shop?.shop_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shop ID:</Text>
            <Text style={styles.value}>{shop?.shop_id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shop Address:</Text>
            <Text style={styles.value} numberOfLines={1}>
              {shop?.shop_address}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Page Info</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Page Size:</Text>
            <Text style={styles.value}>{orderDetails.pageSize}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{orderDetails.color}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Chosen File:</Text>
            <Text style={styles.value} numberOfLines={2}>
              {orderDetails.pdfName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Print Type:</Text>
            <Text style={styles.value}>{orderDetails.printType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Pages:</Text>
            <Text style={styles.value}>{orderDetails.noOfPages}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Price per page:</Text>
            <Text style={styles.value}>Rs. {priceRatePerPage}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Price:</Text>
            <Text style={styles.value}>
              {orderDetails.noOfPages} * {priceRatePerPage} = Rs. {totalAmount}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton} onPress={handleBackButton}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.nextButton}
          onPress={() => handleCheckout(totalAmount)}
        >
          <Text style={styles.nextButtonText}>Proceed to Pay</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    // alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  checkoutInfo: {
    width: "35%",
    alignSelf: "center",
    gap: 10,
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#FFA500",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 5,
  },
  label: {
    fontWeight: "500",
    color: "#AAAAAA",
    fontSize: 16,
    flex: 1,
  },
  value: {
    fontWeight: "500",
    color: "white",
    fontSize: 16,
    flex: 2,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: "2%",
    gap: 20,
  },
  cancelButton: {
    width: 143,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    backgroundColor: "black",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
  nextButton: {
    width: 143,
    borderRadius: 8,
    height: 44,
    backgroundColor: "#B0B5C9",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
});
