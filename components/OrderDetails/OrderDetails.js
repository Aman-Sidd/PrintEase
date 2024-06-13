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
import myApi from "../../api/myApi";
import { Button } from "react-native-paper";
import OrderQRCode from "../helpers/UserQRCode.native";
import { useNavigation } from "@react-navigation/native";
import {
  StatusToColorConvertor,
  ValueToStatusConvertor,
} from "../helpers/StatusConversion";
import { getPerPagePrice } from "../helpers/GetPerPagePrice";
import LoadingScreen from "../utils/LoadingScreen";
import UnderlinedText from "../formUtils/UnderlinedText";
import { convertTimeToAMPM, formatDate } from "../utils/formatDateTime";
import { getShopDetails } from "../../api/methods/getShopDetails";

const OrderDetails = ({ order_id, isOwner, _id }) => {
  console.log("orderDetails_id:", _id);
  const navigation = useNavigation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
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
        console.log("OrderDetailsResp:", orderDetailsResponse.data);
        setOrderDetails(orderDetailsResponse?.data);
        const shopDetails = await getShopDetails({
          shop_id: orderDetailsResponse?.data.shop_id,
        });
        setShopDetails(shopDetails);
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

  console.log("ShopDetails:", shopDetails);

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
      >
        <View style={styles.checkoutInfo}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Shop ID: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              {shopDetails?.shop_id + " "}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Token ID: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              {orderDetails?.id + " "}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Payment ID: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              {orderDetails?.payment_id + " "}
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
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.textStyle}>Sprial Binding: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              {orderDetails?.OrderDetails[0].spiral_binding
                ? "Yes"
                : "No" + " "}
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
              Rs. {orderDetails?.OrderDetails[0].price_per_page + " "}
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
              {orderDetails?.OrderDetails[0].price_per_page} = Rs.{" "}
              {orderDetails?.total_price + " "}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.textStyle}>Time and Date: </Text>
            <Text style={[styles.textStyle, { color: "white" }]}>
              {" "}
              {convertTimeToAMPM(orderDetails?.createdAt) +
                " (" +
                formatDate(orderDetails?.createdAt) +
                ")"}
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
                  color: StatusToColorConvertor(orderStatus),
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

          {/* <View
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
          </View> */}
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
    gap: 10,
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
    fontSize: 16,
    color: "#AAAAAA",
  },
});
