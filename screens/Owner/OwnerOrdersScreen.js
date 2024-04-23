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
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/LoadingScreen";

const OwnerOrdersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");

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
        onPress={() => navigation.navigate("OwnerOrderDetail")}
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
      <Pressable style={styles.statusContainer}>
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
          onPress={() => setActiveStatus("Pending")}
          style={[
            styles.statusButton,
            activeStatus == "Pending"
              ? styles.statusButtonActive
              : styles.statusButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              activeStatus == "Pending"
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            Pending
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveStatus("Printed")}
          style={[
            styles.statusButton,
            activeStatus == "Printed"
              ? styles.statusButtonActive
              : styles.statusButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              activeStatus == "Printed"
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            Printed
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveStatus("HandOver")}
          style={[
            styles.statusButton,
            activeStatus == "HandOver"
              ? styles.statusButtonActive
              : styles.statusButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              activeStatus == "HandOver"
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            Hand Over
          </Text>
        </Pressable>
      </Pressable>
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
