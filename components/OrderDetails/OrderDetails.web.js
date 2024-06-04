import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingScreen from "../utils/LoadingScreen";
import UnderlinedText from "../formUtils/UnderlinedText";
import myApi from "../../api/myApi";
import { RATE16_25, RATE1_15, RATE26Above } from "../../constants/PRICING";
import {
  COLOR_ORDER_STATUS_PENDING,
  COLOR_ORDER_STATUS_PICKED,
  COLOR_ORDER_STATUS_READY,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
} from "../../constants/ORDER_STATUS";
import { Button } from "react-native-paper";
import OrderQRCode from "../helpers/UserQRCode.native";
import { useNavigation } from "@react-navigation/native";
import {
  StatusToColorConvertor,
  ValueToStatusConvertor,
} from "../helpers/StatusConversion";
import { getPerPagePrice } from "../helpers/GetPerPagePrice";
import { isDesktop } from "../../hooks/isDesktop";

const OrderDetails = ({ order_id, isOwner }) => {
  const navigation = useNavigation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceRatePerPage, setPriceRatePerPage] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  let isPC = isDesktop();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        console.log("Order ID:", order_id);
        const orderDetailsResponse = await myApi.get(
          `/get-order-details?order_id=${order_id}`
        );
        console.log("OrderDetailsResp:", orderDetailsResponse.data);
        setOrderDetails(orderDetailsResponse?.data);
        setPdfUri(
          JSON.parse(orderDetailsResponse?.data.OrderDetails[0].file_details)[0]
        );
        setPriceRatePerPage(
          getPerPagePrice(
            orderDetailsResponse?.data.OrderDetails[0].total_pages
          )
        );
        console.log("status:", orderDetailsResponse?.data.status);
        setOrderStatus(
          ValueToStatusConvertor(orderDetailsResponse?.data.status)
        );
        setLoading(false);
      } catch (err) {
        console.log("Err:", err);
      }
    };
    fetchOrderDetails();
  }, []);

  const openPdf = () => {
    navigation.navigate("PdfView", { uri: pdfUri, showButtons: false });
  };

  const handleChangeOrderStatus = () => {
    navigation.navigate("UpdateOrder", {
      user_id: orderDetails.user_id,
      order_id,
      curr_order_status: orderStatus,
    });
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      console.log("Order ID:", order_id);
      const orderDetailsResponse = await myApi.get(
        `/get-order-details?order_id=${order_id}`
      );
      setOrderDetails(orderDetailsResponse?.data);
      setPdfUri(
        JSON.parse(orderDetailsResponse.data.OrderDetails[0].file_details)[0]
      );
      setPriceRatePerPage(
        getPerPagePrice(orderDetailsResponse?.data.OrderDetails[0].total_pages)
      );
      console.log("status:", orderDetailsResponse?.data.status);
      setOrderStatus(ValueToStatusConvertor(orderDetailsResponse?.data.status));
      setRefreshing(false);
    } catch (err) {
      console.log("Err:", err);
    }
  };

  const handleDownload = () => {
    // For web, create an anchor tag and trigger download
    setLoading(true);
    const link = document.createElement("a");
    link.href = pdfUri;
    link.download = "document.pdf"; // Name of the file to download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={
          {
            //   justifyContent: "center",
            //   alignItems: "center",
          }
        }
      >
        <View style={{ ...styles.checkoutInfo, width: isPC ? "40%" : "90%" }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Transaction ID:{" "}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: "white", fontSize: isPC ? 18 : 15 },
              ]}
            >
              {" "}
              2325158412 &nbsp;
            </Text>
          </View>

          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Page Size:{" "}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: "white", fontSize: isPC ? 18 : 15 },
              ]}
            >
              {" "}
              {orderDetails?.OrderDetails[0].page_size + " "}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Color:{" "}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: "white", fontSize: isPC ? 18 : 15 },
              ]}
            >
              {" "}
              {orderDetails?.OrderDetails[0].print_color + " "}
            </Text>
          </View>
          <View
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Chosen File:{" "}
            </Text>
            <Pressable onPress={handleDownload}>
              <UnderlinedText
                numberOfLines={1}
                style={[
                  styles.textStyle,
                  { color: "white", fontSize: isPC ? 18 : 15 },
                ]}
              >
                {orderDetails?.order_title}
              </UnderlinedText>
            </Pressable>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Total Pages:{" "}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: "white", fontSize: isPC ? 18 : 15 },
              ]}
            >
              {" "}
              {orderDetails?.OrderDetails[0].total_pages + " "}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Price per page:{" "}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: "white", fontSize: isPC ? 18 : 15 },
              ]}
            >
              {" "}
              Rs. {priceRatePerPage + " "}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Total Price:{" "}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: "white", fontSize: isPC ? 18 : 15 },
              ]}
            >
              {" "}
              {orderDetails?.OrderDetails[0].total_pages} * Rs.{" "}
              {priceRatePerPage} = Rs. {orderDetails?.total_price + " "}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.textStyle, fontSize: isPC ? 18 : 15 }}>
              Order Status:{" "}
            </Text>
            <Text
              style={[
                styles.textStyle,
                {
                  color: StatusToColorConvertor(orderStatus),
                  fontSize: isPC ? 18 : 15,
                },
              ]}
            >
              {" "}
              {orderStatus + " "}
            </Text>
          </View>

          {!isOwner && (
            <View
              style={{
                alignSelf: "center",
                borderRadius: 5,
                borderColor: "white",
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                padding: 8,
              }}
            >
              <OrderQRCode orderId={order_id} />
            </View>
          )}

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
              Paid &nbsp;
            </Text>
          </View>
        </View>
        {isOwner && (
          <Button
            style={{
              marginTop: 20,
              width: isPC ? "20%" : "80%",
              alignSelf: "center",
            }}
            mode="contained"
            onPress={handleChangeOrderStatus}
          >
            Change Order Status
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  checkoutInfo: {
    gap: 15,
    width: "40%",
    justifyContent: "center",
    marginTop: "2%",
    borderRadius: 10,
    alignSelf: "center",
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#1E1E1E",
    // backgroundColor: "red",
  },
  textStyle: {
    fontWeight: "500",
    color: "white",
    fontSize: 18,
    color: "#AAAAAA",
  },
});
