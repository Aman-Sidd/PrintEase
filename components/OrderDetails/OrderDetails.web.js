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
import { getShopDetails } from "../../api/methods/getShopDetails";
import { convertTimeToAMPM, formatDate } from "../utils/formatDateTime";

const OrderDetails = ({ order_id, isOwner }) => {
  const navigation = useNavigation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceRatePerPage, setPriceRatePerPage] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [shopInfoExpanded, setShopInfoExpanded] = useState(false);
  const [orderDetailsExpanded, setOrderDetailsExpanded] = useState(true);
  const [pricingExpanded, setPricingExpanded] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);
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
  console.log("ShopDetails:", shopDetails);
  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
        paddingBottom: 20,
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
            <Text style={{ ...styles.sectionTitle, fontSize: isPC ? 18 : 15 }}>
              Order Details
            </Text>
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
                <Pressable onPress={handleDownload} style={{ width: "98%" }}>
                  <UnderlinedText numberOfLines={1} style={styles.value}>
                    {orderDetails?.order_title}
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
                <View
                  style={{
                    alignSelf: "center",
                    borderRadius: 5,
                    borderColor: "white",
                    backgroundColor: "white",
                    justifyContent: "center",
                    marginTop: 3,
                    alignItems: "center",
                    padding: 8,
                  }}
                >
                  <OrderQRCode orderId={order_id} />
                </View>
              )}
            </View>
          )}

          <Pressable
            style={styles.sectionHeader}
            onPress={() => setPricingExpanded(!pricingExpanded)}
          >
            <Text style={{ ...styles.sectionTitle, fontSize: isPC ? 18 : 15 }}>
              Pricing
            </Text>
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
                <Text style={styles.value}>Rs. {priceRatePerPage} </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Price: </Text>
                <Text style={styles.value}>
                  {orderDetails?.OrderDetails[0].total_pages} X Rs.{" "}
                  {priceRatePerPage} = Rs. {orderDetails?.total_price}{" "}
                </Text>
              </View>
            </View>
          )}
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
  },
  textStyle: {
    fontWeight: "500",
    color: "white",
    fontSize: 18,
    color: "#AAAAAA",
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
});
