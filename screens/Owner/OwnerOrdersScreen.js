import {
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
import LoadingScreen from "../../components/LoadingScreen";
import {
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
} from "../../constants/ORDER_STATUS";

const OwnerOrdersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderList = async () => {
    try {
      setLoading(true);
      const response = await myApi.get("/user/my-orders");
      setOrdersList(
        response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const renderListItem = ({ item }) => {
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
          <Text style={styles.listItemPrice}>Rs. {item?.total_price}</Text>
          <Text
            style={[
              styles.listItemStatus,
              {
                color:
                  item.status === 2
                    ? "#4CAF50"
                    : item.status === 1
                    ? "#2196F3"
                    : "#FFC107",
              },
            ]}
          >
            {item?.status == 0
              ? ORDER_STATUS_PENDING
              : item?.status == 1
              ? ORDER_STATUS_READY
              : ORDER_STATUS_PICKED}
          </Text>
        </View>
      </Pressable>
    );
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await myApi.get("/user/my-orders");
      setOrdersList(
        response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView style={{ backgroundColor: "black", flex: 1, paddingTop: 20 }}>
      <Text style={styles.headerTitle}>Your Orders</Text>
      <View style={styles.statusContainer}>
        <Pressable
          onPress={() => setActiveStatus("All")}
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
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveStatus(ORDER_STATUS_PENDING)}
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
            {ORDER_STATUS_PENDING}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveStatus(ORDER_STATUS_READY)}
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
            {ORDER_STATUS_READY}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveStatus(ORDER_STATUS_PICKED)}
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
            {ORDER_STATUS_PICKED}
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
  listItemName: { color: "white", fontSize: 20, marginLeft: 20 },
  listItemPrice: { color: "white", fontSize: 20 },
  listItemStatus: { fontSize: 14, textAlign: "center" },
});
