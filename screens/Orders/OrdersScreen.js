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
import { useSelector } from "react-redux";

const OrdersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [ordersList, setOrdersList] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const shop = useSelector((state) => state.order.shop);

  console.log("SHOP:", shop);
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
      console.log("PAGE_LIMIT:", PAGE_LIMIT);
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
          navigation.navigate("OrderDetail", {
            order_id: item.order_id,
            _id: item.id,
          })
        }
        style={styles.listStyle}
      >
        {console.log("id:", item.id)}
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
    height: 75,
    paddingVertical: "4%",
    width: "90%",
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
    justifyContent: "space-evenly",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 15,
  },

  statusButton: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#F3F3F2",
  },
  statusTextInactive: {
    color: "black",
  },
  statusTextActive: {
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
  listItemStatus: { fontSize: 14, textAlign: "center" },
});
