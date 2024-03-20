import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RazorpayCheckout from "react-native-razorpay";

const CheckoutScreen = () => {
  const handleCheckout = () => {
    var options = {
      description: "Credits towards consultation",
      image: "https://i.imgur.com/3g7nmJC.jpg",
      currency: "INR",
      // upi_link: true,
      key: "rzp_test_1ssVL4OvAlLVyS",
      amount: "5000",
      name: "Print Ease",
      order_id: "", //Replace this with an order_id created using Orders API.
      prefill: {
        email: "amansidd.official@gmail.com",
        contact: "9369776397",
        name: "Aman Siddiqui",
      },
      theme: { color: "#53a20e" },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        console.log("DATA: ", data);
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "black", flex: 1, alignItems: "center" }}
    >
      <View style={styles.checkoutInfo}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Page Size:</Text>
          <Text style={[styles.textStyle, { color: "white" }]}> A4</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Color:</Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            Black & White
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Chosen File:</Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            frontpage.pdf
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Print Type:</Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            Both Sided
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Total Pages:</Text>
          <Text style={[styles.textStyle, { color: "white" }]}> 12</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Price per page:</Text>
          <Text style={[styles.textStyle, { color: "white" }]}> Rs. 2.5</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Total Price:</Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            12 * 2.5 = Rs. 30
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={handleCheckout}>
          <Text style={styles.nextButtonText}>Proceed to Pay</Text>
        </Pressable>
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
