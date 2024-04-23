import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingScreen from "../../components/LoadingScreen";
import UnderlinedText from "../../components/UnderlinedText";
import myApi from "../../api/myApi";
import { RATE16_25, RATE1_15, RATE26Above } from "../../constants/PRICING";

const OwnerOrderDetailScreen = ({ navigation, route }) => {
  const { order_id } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceRatePerPage, setPriceRatePerPage] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        console.log("Order ID:", order_id);
        const orderDetailsResponse = await myApi.get(
          `/user/get-order-details?order_id=${order_id}`
        );
        setOrderDetails(orderDetailsResponse?.data);
        setPdfUri(
          JSON.parse(orderDetailsResponse.data.OrderDetails[0].file_details)[0]
        );
        setPriceRatePerPage(
          orderDetailsResponse?.data.OrderDetails[0].total_pages <= 15
            ? RATE1_15
            : orderDetailsResponse?.data.OrderDetails[0].total_pages <= 25
            ? RATE16_25
            : RATE26Above
        );
      } catch (err) {
        console.log("Err:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, []);

  const openPdf = () => {
    navigation.navigate("PdfView", { uri: pdfUri, showButtons: false });
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <View style={styles.checkoutInfo}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Transaction ID: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            2325158412
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Page Size: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            {orderDetails?.OrderDetails[0].page_size}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Color: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            {orderDetails?.OrderDetails[0].print_color}
          </Text>
        </View>
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <Text style={styles.textStyle}>Chosen File: </Text>
          <Pressable onPress={openPdf}>
            <UnderlinedText
              numberOfLines={2}
              style={[styles.textStyle, { color: "white" }]}
            >
              {orderDetails?.order_title}
            </UnderlinedText>
          </Pressable>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Total Pages: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            {orderDetails?.OrderDetails[0].total_pages}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.textStyle}>Price per page: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            Rs. {priceRatePerPage}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.textStyle}>Total Price: </Text>
          <Text style={[styles.textStyle, { color: "white" }]}>
            {" "}
            {orderDetails?.OrderDetails[0].total_pages} * Rs. {priceRatePerPage}{" "}
            = Rs. {orderDetails?.total_price}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <MaterialIcons
            name="paid"
            size={13}
            color="green"
            style={{ margin: 2 }}
          />
          <Text
            style={[
              styles.textStyle,
              { color: "green", fontSize: 13, fontWeight: "bold" },
            ]}
          >
            Paid
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OwnerOrderDetailScreen;

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
});
