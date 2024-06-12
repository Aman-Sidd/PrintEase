import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/utils/LoadingScreen";
import {
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
  PENDING,
} from "../../constants/ORDER_STATUS";
import {
  StatusToValueConvertor,
  ValueToStatusColorConvertor,
  ValueToStatusConvertor,
} from "../../components/helpers/StatusConversion";
import { getAllOrders } from "../../api/methods/getAllOrders";
import { PAGE_LIMIT } from "../../constants/PAGE_LIMIT";
import { getPendingOrders } from "../../api/methods/getPendingOrders";
import { getPrintedOrders } from "../../api/methods/getPrintedOrders";
import { getPickedOrders } from "../../api/methods/getPickedOrders";
import { Button } from "react-native-paper";
import { ActivityIndicator } from "react-native";
import {
  convertTimeToAMPM,
  formatDate,
} from "../../components/utils/formatDateTime";
import { setIsDesktop } from "../../redux/UtilSlice";
import { useMediaQuery } from "react-responsive";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { isDesktop, isDesktopOrLaptop } from "../../hooks/isDesktop";
import { useSelector } from "react-redux";

let isPC;

const OrdersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [ordersList, setOrdersList] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const shop = useSelector((state) => state.order.shop);

  isPC = isDesktop();
  console.log("isDesk:", isPC);
  const fetchOrderList = async (status = activeStatus, page = 0) => {
    try {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      const limit = PAGE_LIMIT;
      const offset = page * PAGE_LIMIT;
      let response = null;

      switch (status) {
        case "All":
          response = await getAllOrders({
            shop_id: shop.shop_id,
            limit,
            offset,
          });
          break;

        case ORDER_STATUS_PENDING:
          response = await getPendingOrders({
            shop_id: shop.shop_id,
            limit,
            offset,
          });
          break;

        case ORDER_STATUS_READY:
          response = await getPrintedOrders({
            shop_id: shop.shop_id,
            limit,
            offset,
          });
          break;
        case ORDER_STATUS_PICKED:
          response = await getPickedOrders({
            shop_id: shop.shop_id,
            limit,
            offset,
          });
          break;
        default:
          response = null;
      }
      if (!response) {
        setHasMore(false);
        return;
      }

      const newData = response || [];
      console.log("new data len:", newData.length);
      console.log("PAGE_LIMIT: ", PAGE_LIMIT);
      if (newData.length < PAGE_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      if (page === 0) {
        setOrdersList(newData);
      } else {
        setOrdersList([...ordersList, ...newData]);
      }
      const nextOffset = page + 1;
      setOffset(nextOffset);
    } catch (err) {
      Alert.alert("Error", "Something went wrong, Try Again!");
      console.log(err);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  const loadMore = async () => {
    console.log("Clicked...");
    if (hasMore) {
      console.log("Entered");
      await fetchOrderList(activeStatus, offset);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchOrderList(activeStatus);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const handleStatusButton = async (status) => {
    await fetchOrderList(status);
    setActiveStatus(status);
  };

  const renderFooter = () => {
    return (
      <View>
        {loadingMore ? (
          <ActivityIndicator
            style={{ margin: 8 }}
            size="large"
            color="#0000ff"
          />
        ) : !hasMore ? null : (
          <Button
            style={{ alignSelf: "center", marginTop: 15 }}
            mode="contained"
            onPress={loadMore}
          >
            <Text style={styles.listItemName}>Show More &nbsp;</Text>
          </Button>
        )}
      </View>
    );
  };

  const renderListItem = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("OrderDetail", { order_id: item.order_id })
        }
        style={{
          ...styles.listStyle,
          width: isPC ? "50%" : "80%",
        }}
      >
        <View style={{ maxWidth: "70%" }}>
          <Text numberOfLines={1} style={styles.listItemName}>
            {item?.order_title}
          </Text>
          <Text
            style={{
              ...styles.listItemName,
              fontSize: 12,
              marginTop: 7,
              color: "#CCCCCC",
            }}
          >
            {convertTimeToAMPM(item.createdAt) +
              " (" +
              formatDate(item.createdAt) +
              ")"}
          </Text>
        </View>
        <View style={{ paddingRight: 20 }}>
          <Text style={styles.listItemPrice}>Rs. {item?.total_price}</Text>
          <Text
            numberOfLines={1}
            style={[
              styles.listItemStatus,
              {
                color: ValueToStatusColorConvertor(item?.status),
              },
            ]}
          >
            {ValueToStatusConvertor(item?.status)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView style={{ backgroundColor: "black", flex: 1, paddingTop: 20 }}>
      <Text style={styles.headerTitle}>Your Orders</Text>
      <View style={styles.statusContainer}>
        <Pressable
          onPress={() => handleStatusButton("All")}
          style={[
            styles.statusButton,
            {
              paddingHorizontal: isPC
                ? widthPercentageToDP("3%")
                : widthPercentageToDP("2%"),
            },
            activeStatus == "All"
              ? styles.statusButtonActive
              : styles.statusButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              activeStatus == "All"
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            All &nbsp;
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleStatusButton(ORDER_STATUS_PENDING)}
          style={[
            styles.statusButton,
            {
              paddingHorizontal: isPC
                ? widthPercentageToDP("3%")
                : widthPercentageToDP("2%"),
            },
            activeStatus == ORDER_STATUS_PENDING
              ? styles.statusButtonActive
              : styles.statusButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              activeStatus == ORDER_STATUS_PENDING
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {ORDER_STATUS_PENDING + " "}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleStatusButton(ORDER_STATUS_READY)}
          style={[
            styles.statusButton,
            {
              paddingHorizontal: isPC
                ? widthPercentageToDP("3%")
                : widthPercentageToDP("2%"),
            },
            activeStatus == ORDER_STATUS_READY
              ? styles.statusButtonActive
              : styles.statusButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              activeStatus == ORDER_STATUS_READY
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {ORDER_STATUS_READY + " "}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleStatusButton(ORDER_STATUS_PICKED)}
          style={[
            styles.statusButton,
            {
              paddingHorizontal: isPC
                ? widthPercentageToDP("3%")
                : widthPercentageToDP("2%"),
            },
            activeStatus == ORDER_STATUS_PICKED
              ? styles.statusButtonActive
              : styles.statusButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              activeStatus == ORDER_STATUS_PICKED
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {ORDER_STATUS_PICKED + " "}
          </Text>
        </Pressable>
      </View>
      {/* FlatList container */}
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <FlatList
          style={{ flex: 1 }} // Ensure FlatList has flex: 1
          data={ordersList}
          keyExtractor={(item) => item.id.toString()} // Convert id to string
          renderItem={renderListItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  listStyle: {
    // height: 75,
    paddingVertical: "1%",
    width: "50%",
    marginTop: 15,
    borderRadius: 8,
    // marginLeft: 8,
    alignSelf: "center",
    backgroundColor: "#202020",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusContainer: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  statusText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
  },
  statusButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: heightPercentageToDP("1%"),
    paddingHorizontal: widthPercentageToDP("3%"),
    backgroundColor: "#F3F3F2",
  },
  statusTextInactive: {
    alignSelf: "center",
    color: "black",
  },
  statusTextActive: {
    alignSelf: "center",
    color: "white",
  },
  statusButtonInactive: {
    backgroundColor: "#F3F3F2",
  },
  statusButtonActive: {
    backgroundColor: "#333333",
  },
  listItemName: { color: "white", fontSize: 16, marginLeft: 20 },
  listItemPrice: { color: "white", fontSize: 18 },
  listItemStatus: {
    fontSize: 11,
    textAlign: "center",
  },
});
