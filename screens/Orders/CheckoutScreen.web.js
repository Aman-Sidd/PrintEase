import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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

const CheckoutScreen = ({ navigation }) => {
  const orderDetails = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("file", {
      uri: orderDetails.pdfUri,
      name: orderDetails.pdfName, // Set the file name with appropriate extension
      type: "application/pdf", // Set MIME type for PDF files
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

  // const handleCheckout = async (amount) => {
  //   var options = {
  //     description: RAZORPAY_DESCRIPTION,
  //     image: RAZORPAY_IMAGE_URL,
  //     currency: RAZORPAY_CURRENCY,
  //     // upi_link: true,
  //     key: RAZORPAY_API_KEY,
  //     amount: amount * 100,
  //     name: RAZORPAY_ORG_NAME,
  //     order_id: "", //Replace this with an order_id created using Orders API.
  //     prefill: {
  //       email: RAZORPAY_PREFILL_EMAIL,
  //       contact: RAZORPAY_PREFILL_CONTACT,
  //       name: RAZORPAY_PREFILL_NAME,
  //     },
  //     theme: { color: "#53a20e" },
  //   };
  //   const order_id = await placeOrder();

  //   if (order_id === null) {
  //     Alert.alert("Failed!", "Something went wrong.");
  //     return;
  //   }
  //   console.log("Order Id from CheckoutScreen:", order_id);
  //   RazorpayCheckout.open(options)
  //     .then(async (data) => {
  //       // handle success
  //       console.log("DATA: ", data);

  //       await updatePaymentInfo({
  //         orderid: order_id,
  //         paymentid: data.razorpay_payment_id,
  //       });
  //     })
  //     .catch((error) => {
  //       // handle failure
  //       console.log("Error:", error);
  //       const errorObject = JSON.parse(error.description);
  //       // console.log(errorObject);
  //       Alert.alert("Error", `${errorObject.error.description}`);
  //       // alert(`Error: ${errorObject.error.description}`);
  //     });
  // };

  const priceRatePerPage = getPerPagePrice(orderDetails.noOfPages);

  const totalAmount = orderDetails.noOfPages * priceRatePerPage;

  const handleBackButton = () => {
    navigation.pop();
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView
      style={{ backgroundColor: "black", flex: 1, alignItems: "center" }}
    >
      <View style={styles.checkoutInfo}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Page Size: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.pageSize} &nbsp;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Color: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.color} &nbsp;
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <Text style={styles.textStyle}>Chosen File: </Text>
          <Text
            numberOfLines={2}
            style={[styles.textStyle, { color: "white" }]}
          >
            {orderDetails.pdfName + " "}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Print Type: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.printType} &nbsp;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Total Pages: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.noOfPages} &nbsp;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Price per page: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            Rs. {priceRatePerPage} &nbsp;
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Total Price: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.noOfPages} * {priceRatePerPage} = Rs. {totalAmount}
            &nbsp;
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton} onPress={handleBackButton}>
          <Text style={styles.cancelButtonText}>Back &nbsp;</Text>
        </Pressable>
        <Pressable
          style={styles.nextButton}
          onPress={() => handleCheckout(totalAmount)}
        >
          <Text style={styles.nextButtonText}>Proceed to Pay &nbsp;</Text>
        </Pressable>
        {/* <MailSender /> */}
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  checkoutInfo: {
    width: "80%",
    gap: 15,
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    backgroundColor: "#1E1E1E",
  },
  textStyle: {
    fontWeight: "500",
    color: "white",
    fontSize: 18,
    color: "#AAAAAA",
  },
  buttonContainer: {
    display: "flex",
    gap: 20,
    flexDirection: "row",
    marginTop: 50,
  },
  nextButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
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
  cancelButton: {
    width: 143,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    backgroundColor: "black",
  },
});
