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
import LoadingScreen from "../LoadingScreen";
import UnderlinedText from "../UnderlinedText";
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
import OrderQRCode from "../UserQRCode";
import { useNavigation } from "@react-navigation/native";

const OrderDetails = ({ order_id, isOwner }) => {
  const navigation = useNavigation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceRatePerPage, setPriceRatePerPage] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        console.log("Order ID:", order_id);
        const orderDetailsResponse = await myApi.get(
          `/get-order-details?order_id=${order_id}`
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
        console.log("status:", orderDetailsResponse?.data.status);
        setOrderStatus(
          orderDetailsResponse?.data.status == 0
            ? ORDER_STATUS_PENDING
            : orderDetailsResponse?.data.status == 1
            ? ORDER_STATUS_READY
            : ORDER_STATUS_PICKED
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

  const handleChangeOrderStatus = () => {
    navigation.navigate("UpdateOrder", {
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
        orderDetailsResponse?.data.OrderDetails[0].total_pages <= 15
          ? RATE1_15
          : orderDetailsResponse?.data.OrderDetails[0].total_pages <= 25
          ? RATE16_25
          : RATE26Above
      );
      console.log("status:", orderDetailsResponse?.data.status);
      setOrderStatus(
        orderDetailsResponse?.data.status == 0
          ? ORDER_STATUS_PENDING
          : orderDetailsResponse?.data.status == 1
          ? ORDER_STATUS_READY
          : ORDER_STATUS_PICKED
      );
    } catch (err) {
      console.log("Err:", err);
    } finally {
      setRefreshing(false);
    }
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
        <View style={styles.checkoutInfo}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Transaction ID: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              2325158412 &nbsp;
            </Text>
          </View>

          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Page Size: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              {orderDetails?.OrderDetails[0].page_size + " "}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Color: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              {orderDetails?.OrderDetails[0].print_color + " "}
            </Text>
          </View>
          <View
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            <Text style={styles.textStyle}>Chosen File: </Text>
            <Pressable onPress={openPdf}>
              <UnderlinedText
                numberOfLines={1}
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
              {orderDetails?.OrderDetails[0].total_pages + " "}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Price per page: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
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
            <Text style={styles.textStyle}>Total Price: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
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
            <Text style={styles.textStyle}>Order Status: </Text>
            <Text
              style={[
                styles.textStyle,
                {
                  color:
                    orderStatus === ORDER_STATUS_PICKED
                      ? COLOR_ORDER_STATUS_PICKED
                      : orderStatus === ORDER_STATUS_READY
                      ? COLOR_ORDER_STATUS_READY
                      : COLOR_ORDER_STATUS_PENDING,
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
            style={{ marginTop: 20, width: "50%", alignSelf: "center" }}
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
    width: "90%",
    justifyContent: "center",
    borderRadius: 10,
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
