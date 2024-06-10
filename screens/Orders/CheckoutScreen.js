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

const savePendingUpdate = async (update) => {
  let pendingUpdates = await AsyncStorage.getItem("pendingUpdates");
  pendingUpdates = pendingUpdates ? JSON.parse(pendingUpdates) : [];
  pendingUpdates.push(update);
  await AsyncStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
};

const getPendingUpdates = async () => {
  let pendingUpdates = await AsyncStorage.getItem("pendingUpdates");
  return pendingUpdates ? JSON.parse(pendingUpdates) : [];
};

const removePendingUpdate = async (index) => {
  let pendingUpdates = await AsyncStorage.getItem("pendingUpdates");
  pendingUpdates = pendingUpdates ? JSON.parse(pendingUpdates) : [];
  pendingUpdates.splice(index, 1);
  await AsyncStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
};

const updatePaymentInfoWithRetry = async (updateInfo, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await updatePaymentId(updateInfo);
      return true; // Successful update
    } catch (error) {
      if (attempt === retries - 1) {
        await savePendingUpdate(updateInfo);
        return false; // Failed after all retries
      }
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
    }
  }
};

const CheckoutScreen = ({ navigation }) => {
  const orderDetails = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processPendingUpdates = async () => {
      const pendingUpdates = await getPendingUpdates();
      for (let i = 0; i < pendingUpdates.length; i++) {
        const updateInfo = pendingUpdates[i];
        try {
          await updatePaymentId(updateInfo);
          await removePendingUpdate(i);
        } catch (error) {
          console.error(
            "Failed to update payment info from pending updates",
            error
          );
        }
      }
    };

    // Periodically attempt to process pending updates
    const intervalId = setInterval(processPendingUpdates, 60000); // Every 1 minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const placeOrder = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("file", {
      uri: orderDetails.pdfUri,
      name: orderDetails.pdfName,
      type: "application/pdf",
    });
    formData.append("title", orderDetails.pdfName);
    formData.append("totalprice", orderDetails.noOfPages * priceRatePerPage);
    formData.append("pagesize", orderDetails.pageSize);
    formData.append("color", orderDetails.color);
    formData.append("printtype", orderDetails.printType);
    formData.append("totalpages", orderDetails.noOfPages);
    formData.append("priceperpage", priceRatePerPage);
    formData.append("paymentid", 12345);

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
      console.log("Error while creating order:", err.response);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (amount) => {
    var options = {
      description: RAZORPAY_DESCRIPTION,
      image: RAZORPAY_IMAGE_URL,
      currency: RAZORPAY_CURRENCY,
      key: RAZORPAY_API_KEY,
      amount: amount * 100,
      name: RAZORPAY_ORG_NAME,
      order_id: "",
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
        console.log("DATA: ", data);

        const updateInfo = {
          orderid: order_id,
          paymentid: data?.razorpay_payment_id,
        };

        const success = await updatePaymentInfoWithRetry(updateInfo);
        if (success) {
          await sendPushNotification({
            user_id: OWNER_USER_ID,
            message: "New Order Has Been Received.",
          });
        } else {
          Alert.alert("Warning", "Payment update failed. Will retry later.");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        const errorObject = JSON.parse(error.description);
        Alert.alert("Error", `${errorObject.error.description}`);
      });
  };

  const priceRatePerPage = getPerPagePrice(orderDetails.noOfPages);
  const totalAmount = orderDetails.noOfPages * priceRatePerPage;

  const handleBackButton = () => {
    navigation.pop();
  };

  console.log("user from checkoutscreen:", user);

  return loading ? (
    <LoadingScreen />
  ) : (
    <ScrollView style={styles.container}>
      <View style={styles.checkoutInfo}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Info</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Shop Name:</Text>
            <Text style={styles.value}>{user.shop?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shop ID:</Text>
            <Text style={styles.value}>{user.shop?.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shop Address:</Text>
            <Text style={styles.value} numberOfLines={1}>
              {user.shop?.address}
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
