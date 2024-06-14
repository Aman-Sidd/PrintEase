import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RazorpayCheckout from "react-native-razorpay";
import { useSelector } from "react-redux";
import {
  RAZORPAY_API_KEY,
  RAZORPAY_CURRENCY,
  RAZORPAY_DESCRIPTION,
  RAZORPAY_IMAGE_URL,
  RAZORPAY_ORG_NAME,
} from "../../constants/RAZORPAY";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/utils/LoadingScreen";
import { updatePaymentId } from "../../api/methods/updatePaymentId";
import { getPerPagePrice } from "../../components/helpers/GetPerPagePrice";
import { sendPushNotification } from "../../api/methods/sendPushNotification";
import { OWNER_USER_ID } from "../../constants/OwnerCredentials";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { setLoading } from "../../redux/UtilSlice";

const CheckoutScreen = ({ navigation }) => {
  const orderDetails = useSelector((state) => state.order);
  const shop = useSelector((state) => state.order.shop);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const placeOrder = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("file", {
      uri: orderDetails.pdfUri,
      name: orderDetails.pdfName, // Set the file name with appropriate extension
      type: "application/pdf", // Set MIME type for PDF files
    });
    formData.append("title", orderDetails.pdfName);
    formData.append("totalprice", totalPagesRequired * priceRatePerPage);
    formData.append("pagesize", orderDetails.pageSize);
    formData.append("color", orderDetails.color);
    formData.append("printtype", orderDetails.printType);
    formData.append("totalpages", totalPagesRequired);
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
      } else return null;
    } catch (err) {
      console.log("Error while creating order:", err.response.data);
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

  const handleCheckout = async (amount) => {
    var options = {
      description: RAZORPAY_DESCRIPTION,
      image: RAZORPAY_IMAGE_URL,
      currency: RAZORPAY_CURRENCY,
      // upi_link: true,
      key: RAZORPAY_API_KEY,
      amount: amount * 100,
      name: RAZORPAY_ORG_NAME,
      order_id: "", //Replace this with an order_id created using Orders API.
      prefill: {
        email: user?.data.email,
        contact: user?.data.phone,
        name: user?.data.username,
      },
      theme: { color: "#53a20e" },
    };
    const order_id = await placeOrder();

    if (order_id === null) {
      Alert.alert("Failed!", "Something went wrong.");
      return;
    }
    console.log("Order Id from CheckoutScreen:", order_id);
    RazorpayCheckout.open(options)
      .then(async (data) => {
        // handle success
        console.log("DATA: ", data);

        await updatePaymentInfo({
          orderid: order_id,
          paymentid: data.razorpay_payment_id,
        });

        await sendPushNotification({
          user_id: shop.User.user_id,
          message: "New Order Has Been Received.",
        });

        navigation.pop();
        navigation.navigate("Orders");
      })
      .catch((error) => {
        // handle failure
        console.log("Error:", error);
        const errorObject = JSON.parse(error.description);
        // console.log(errorObject);
        Alert.alert("Error", `${errorObject.error.description}`);
        // alert(`Error: ${errorObject.error.description}`);
      });
  };

  const priceRatePerPage = getPerPagePrice(orderDetails.noOfPages);
  const totalPagesRequired =
    orderDetails.printType === "Single Sided"
      ? orderDetails.noOfPages
      : Math.ceil(orderDetails.noOfPages / 2);
  const totalAmount = totalPagesRequired * priceRatePerPage;

  const handleBackButton = () => {
    navigation.pop();
  };
  // console.log("user from checkoutscreen:", user);

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
            <Text style={styles.label}>Contact No:</Text>
            <Text style={styles.value}>{shop?.shop_phone}</Text>
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
            <Text style={styles.label}>Total Pages Required:</Text>
            <Text style={styles.value}>{totalPagesRequired}</Text>
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
              {totalPagesRequired} * Rs. {priceRatePerPage} = Rs. {totalAmount}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton} onPress={handleBackButton}>
          <Text style={styles.cancelButtonText}>Back </Text>
        </Pressable>
        <Pressable
          style={styles.nextButton}
          onPress={() => handleCheckout(totalAmount)}
        >
          <Text style={styles.nextButtonText}>Proceed to Pay </Text>
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
    paddingHorizontal: 10,
  },
  checkoutInfo: {
    width: "100%",
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
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginTop: "8%",
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
