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

  const [shopInfoExpanded, setShopInfoExpanded] = useState(false);
  const [orderDetailsExpanded, setOrderDetailsExpanded] = useState(true);
  const [pricingExpanded, setPricingExpanded] = useState(false);

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
        const shopDetailsResponse = await getShopDetails({
          shop_id: orderDetailsResponse?.data.shop_id,
        });
        setShopDetails(shopDetailsResponse);
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
      const shopDetailsResponse = await getShopDetails({
        shop_id: orderDetailsResponse?.data.shop_id,
      });
      setShopDetails(shopDetailsResponse);
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.checkoutInfo}>
          <Pressable
            style={styles.sectionHeader}
            onPress={() => setShopInfoExpanded(!shopInfoExpanded)}
          >
            <Text style={styles.sectionTitle}>Shop Info </Text>
            <MaterialIcons
              name={shopInfoExpanded ? "expand-less" : "expand-more"}
              size={24}
              color="white"
            />
          </Pressable>
          {shopInfoExpanded && (
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Shop Name: </Text>
                <Text style={styles.value}>{shopDetails?.shop_name} </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Shop ID: </Text>
                <Text style={styles.value}>{shopDetails?.shop_id} </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Shop Address: </Text>
                <Text style={styles.value} numberOfLines={1}>
                  {shopDetails?.shop_address}{" "}
                </Text>
              </View>
            </View>
          )}

          <Pressable
            style={styles.sectionHeader}
            onPress={() => setOrderDetailsExpanded(!orderDetailsExpanded)}
          >
            <Text style={styles.sectionTitle}>Order Details &nbsp;</Text>
            <MaterialIcons
              name={orderDetailsExpanded ? "expand-less" : "expand-more"}
              size={24}
              color="white"
            />
          </Pressable>
          {orderDetailsExpanded && (
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Token ID: </Text>
                <Text style={styles.value}>{orderDetails?.id} </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment ID: </Text>
                <Text style={styles.value}>{orderDetails?.payment_id} </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Page Size: </Text>
                <Text style={styles.value}>
                  {orderDetails?.OrderDetails[0].page_size}{" "}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Color: </Text>
                <Text style={styles.value}>
                  {orderDetails?.OrderDetails[0].print_color}{" "}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Print Type: </Text>
                <Text style={styles.value}>
                  {orderDetails?.OrderDetails[0].print_type}{" "}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sprial Binding: </Text>
                <Text style={styles.value}>
                  {orderDetails?.OrderDetails[0].spiral_binding ? "Yes" : "No"}{" "}
                </Text>
              </View>
              <View style={[styles.row, { display: "flex", flexWrap: "wrap" }]}>
                <Text style={styles.label}>Chosen File: </Text>
                <Pressable onPress={openPdf}>
                  <UnderlinedText numberOfLines={1} style={styles.value}>
                    {orderDetails?.order_title}{" "}
                  </UnderlinedText>
                </Pressable>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Pages: </Text>
                <Text style={styles.value}>
                  {orderDetails?.OrderDetails[0].total_pages}{" "}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Time and Date: </Text>
                <Text style={styles.value}>
                  {" "}
                  {convertTimeToAMPM(orderDetails?.createdAt) +
                    " (" +
                    formatDate(orderDetails?.createdAt) +
                    ")"}{" "}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Order Status: </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: StatusToColorConvertor(orderStatus),
                    },
                  ]}
                >
                  {orderStatus + " "}
                </Text>
              </View>
              {!isOwner && (
                <>
                  <View style={styles.QRcode}>
                    <OrderQRCode orderId={order_id} />
                  </View>
                  <Text style={styles.QRLabel}>
                    Scan QR code while collecting the documents.
                  </Text>
                </>
              )}
            </View>
          )}

          <Pressable
            style={styles.sectionHeader}
            onPress={() => setPricingExpanded(!pricingExpanded)}
          >
            <Text style={styles.sectionTitle}>Pricing </Text>
            <MaterialIcons
              name={pricingExpanded ? "expand-less" : "expand-more"}
              size={24}
              color="white"
            />
          </Pressable>
          {pricingExpanded && (
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Price per page: </Text>
                <Text style={styles.value}>
                  Rs. {orderDetails?.OrderDetails[0].price_per_page}{" "}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Price: </Text>
                <Text style={styles.value}>
                  {orderDetails?.OrderDetails[0].total_pages} X Rs.{" "}
                  {orderDetails?.OrderDetails[0].price_per_page} = Rs.{" "}
                  {orderDetails?.total_price}{" "}
                </Text>
              </View>
            </View>
          )}
        </View>

        {isOwner && (
          <Button
            style={{ marginTop: 20, width: "50%", alignSelf: "center" }}
            mode="contained"
            onPress={handleChangeOrderStatus}
          >
            Change Order Status{" "}
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingBottom: 20,
  },
  checkoutInfo: {
    gap: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#1E1E1E",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  value: {
    fontWeight: "500",
    color: "white",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  QRcode: {
    alignSelf: "center",
    borderRadius: 5,
    borderColor: "white",
    backgroundColor: "white",
    justifyContent: "center",
    marginTop: 3,
    alignItems: "center",
    padding: 8,
  },
  QRLabel: {
    color: "white",
    fontSize: 12,
    color: "gray",
    marginTop: 6,
    textAlign: "center",
  },
});
