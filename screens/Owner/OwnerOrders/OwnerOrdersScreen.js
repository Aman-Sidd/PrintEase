import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import myApi from "../../../api/myApi";
import LoadingScreen from "../../../components/LoadingScreen";
import {
  StatusToValueConvertor,
  ValueToStatusColorConvertor,
  ValueToStatusConvertor,
} from "../../../components/StatusConversion";
import { PAGE_LIMIT } from "../../../constants/PAGE_LIMIT";
import {
  COLOR_ORDER_STATUS_PENDING,
  COLOR_ORDER_STATUS_PICKED,
  COLOR_ORDER_STATUS_READY,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
} from "../../../constants/ORDER_STATUS";
import { getAllOrders } from "../../../api/methods/getAllOrders";
import { getPendingOrders } from "../../../api/methods/getPendingOrders";
import { getPrintedOrders } from "../../../api/methods/getPrintedOrders";
import { getPickedOrders } from "../../../api/methods/getPickedOrders";
import { Button } from "react-native-paper";

const OwnerOrdersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [ordersList, setOrdersList] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchOrderList = async (status = activeStatus, page = 0) => {
    try {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      const limit = PAGE_LIMIT;
      const offset = page * PAGE_LIMIT;
      let response = null;

      switch (status) {
        case "All":
          response = await getAllOrders({ limit, offset });
          break;

        case ORDER_STATUS_PENDING:
          response = await getPendingOrders({ limit, offset });
          break;

        case ORDER_STATUS_READY:
          response = await getPrintedOrders({ limit, offset });
          break;
        case ORDER_STATUS_PICKED:
          response = await getPickedOrders({ limit, offset });
          break;
        default:
          response = null;
      }
      if (!response) return;

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

  useEffect(() => {
    fetchOrderList();
  }, []);

  const renderListItem = ({ item }) => {
    const order_status = ValueToStatusConvertor(item?.status);

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("OwnerOrderDetail", { order_id: item.order_id })
        }
        style={styles.listStyle}
      >
        <View style={{ maxWidth: "70%" }}>
          <Text numberOfLines={2} style={styles.listItemName}>
            {item?.order_title}
          </Text>
        </View>
        <View style={{ paddingRight: 20 }}>
          <Text style={styles.listItemPrice}>
            Rs. {item?.total_price + " "}
          </Text>
          <Text
            style={[
              styles.listItemStatus,
              {
                color: ValueToStatusColorConvertor(item?.status),
              },
            ]}
          >
            {order_status + " "}
          </Text>
        </View>
      </Pressable>
    );
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

  const handleStatusButton = async (status) => {
    await fetchOrderList(status, 0);
    setActiveStatus(status);
  };

  const loadMore = async () => {
    console.log("Clicked...");
    if (hasMore) {
      console.log("Entered");
      await fetchOrderList(activeStatus, offset);
    }
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
            style={{ alignSelf: "center", margin: 10 }}
            mode="contained"
            onPress={loadMore}
          >
            <Text style={styles.listItemName}>Show More &nbsp;</Text>
          </Button>
        )}
      </View>
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
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <FlatList
          style={{ flex: 1 }} // Ensure FlatList has flex: 1
          data={ordersList}
          keyExtractor={(item) => item.id.toString()} // Convert id to string
          renderItem={renderListItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // onEndReached={loadMore}
          // onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
};

export default OwnerOrdersScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
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
  listStyle: {
    height: 75,
    width: "90%",
    marginTop: 20,
    borderRadius: 8,
    // marginLeft: 8,
    alignSelf: "center",
    backgroundColor: "#202020",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItemName: { color: "white", fontSize: 16, marginLeft: 20 },
  listItemPrice: { color: "white", fontSize: 18 },
  listItemStatus: { fontSize: 14, textAlign: "center" },
});
