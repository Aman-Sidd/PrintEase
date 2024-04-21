import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RazorpayCheckout from "react-native-razorpay";
import { useSelector } from "react-redux";
import {
  RAZORPAY_API_KEY,
  RAZORPAY_ORG_NAME,
  RAZORPAY_PREFILL_CONTACT,
  RAZORPAY_PREFILL_EMAIL,
  RAZORPAY_PREFILL_NAME,
} from "../constants/RAZORPAY";
import MailSender from "../components/MailSender";
import { RATE16_25, RATE1_15, RATE26Above } from "../constants/PRICING";
import myApi from "../api/myApi";

const CheckoutScreen = ({ navigation }) => {
  const orderDetails = useSelector((state) => state.order);

  const handleCheckout = async (amount) => {
    var options = {
      description: "Printing Charges",
      image:
        "https://private-user-images.githubusercontent.com/67181624/324244587-b5694c36-eb15-47dc-a875-30183e3eda6f.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTM2OTk5OTgsIm5iZiI6MTcxMzY5OTY5OCwicGF0aCI6Ii82NzE4MTYyNC8zMjQyNDQ1ODctYjU2OTRjMzYtZWIxNS00N2RjLWE4NzUtMzAxODNlM2VkYTZmLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA0MjElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNDIxVDExNDEzOFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWUzMjcxYjBjNzdkMGIxMTdiYmQ5N2I0MTg3OTliZDY5M2RiZmQ1MmEzYzg5NzE3N2RmMDhmNDM3MGVmOTBlNjMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0._Pom4dQcRdVGH72fH7CoNd6NItaH7AhwRGLTj-gr1ZA",
      currency: "INR",
      // upi_link: true,
      key: RAZORPAY_API_KEY,
      amount: amount * 100,
      name: RAZORPAY_ORG_NAME,
      order_id: "", //Replace this with an order_id created using Orders API.
      prefill: {
        email: RAZORPAY_PREFILL_EMAIL,
        contact: RAZORPAY_PREFILL_CONTACT,
        name: RAZORPAY_PREFILL_NAME,
      },
      theme: { color: "#53a20e" },
    };
    RazorpayCheckout.open(options)
      .then(async (data) => {
        // handle success
        console.log("DATA: ", data);
        // alert(
        //   `Success: Order has been created with Txn ID: ${data.razorpay_payment_id}`
        // );
      })
      .catch((error) => {
        // handle failure
        const errorObject = JSON.parse(error.description);
        console.log(errorObject);
        alert(`Error: ${errorObject.error.description}`);
      });
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

    try {
      const response = await myApi.post("/user/create-order", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("RESPONSE:", response.data);
    } catch (err) {
      console.log("ERROR:", err.response.data);
    }
  };

  const priceRatePerPage =
    orderDetails.noOfPages <= 15
      ? RATE1_15
      : orderDetails.noOfPages <= 25
      ? RATE16_25
      : RATE26Above;

  const handleBackButton = () => {
    navigation.pop();
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "black", flex: 1, alignItems: "center" }}
    >
      <View style={styles.checkoutInfo}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Page Size: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.pageSize}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Color: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.color}
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
            {orderDetails.pdfName}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Print Type: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.printType}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Total Pages: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.noOfPages}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Price per page: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            Rs. {priceRatePerPage}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Total Price: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {orderDetails.noOfPages} * {priceRatePerPage} = Rs.{" "}
            {orderDetails.noOfPages * priceRatePerPage}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton} onPress={handleBackButton}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.nextButton}
          onPress={() =>
            handleCheckout((amount = orderDetails.noOfPages * priceRatePerPage))
          }
        >
          <Text style={styles.nextButtonText}>Proceed to Pay</Text>
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
