import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import myApi from "../api/myApi";
import LoadingScreen from "../components/LoadingScreen";

const OrdersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]);

  const listOrders = [
    {
      id: 1,
      name: "frontpage.pdf",
      price: 50,
      status: "Delivered",
    },
    {
      id: 2,
      name: "backpage.pdf",
      price: 100,
      status: "Done",
    },
    {
      id: 4,
      name: "assignment.pdf",
      price: 150,
      status: "Pending",
    },
  ];

  useEffect(() => {
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
    fetchOrderList();
  }, []);

  const renderListItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate("OrderDetail")}
        style={styles.listStyle}
      >
        <Text style={styles.listItemName}>{item?.order_title}</Text>
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
              ? "Pending"
              : item?.status == 1
              ? "Done"
              : "Hand Over"}
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

      <View>
        {/* <ScrollView>
          {listOrders.map((item) => renderListItem(item))}
        </ScrollView> */}

        <FlatList
          data={ordersList}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
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
