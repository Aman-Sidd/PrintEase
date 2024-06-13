import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useMediaQuery } from "react-responsive";
import { getAllShops } from "../../api/methods/getAllShops";
import { setShop } from "../../redux/OrderSlice";
import LoadingScreen from "../../components/utils/LoadingScreen";

const demoShops = [
  { id: 1, name: "Kumar Photocopy", address: "Integral University" },
];

const ShopsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const fetchedShops = await getAllShops();
        setShops(fetchedShops);
        setFilteredShops(fetchedShops);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      let filtered = shops.filter(
        (shop) =>
          shop.shop_name.toLowerCase().includes(text.toLowerCase()) ||
          shop.shop_address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredShops(filtered);
    } else {
      setFilteredShops(shops);
    }
  };

  const renderListItem = ({ shop }) => {
    return (
      <Pressable
        onPress={() => {
          dispatch(setShop({ shop }));
          navigation.navigate("Main");
        }}
        style={styles.listStyle}
      >
        <View style={{ width: "100%" }}>
          <Text numberOfLines={1} style={styles.listItemName}>
            {shop?.shop_name}
          </Text>

          <Text
            style={{
              ...styles.listItemName,
              fontSize: 12,
              marginTop: 7,
              color: "#CCCCCC",
            }}
          >
            {shop?.shop_address}
          </Text>
          <Text
            style={{
              ...styles.listItemName,
              fontSize: 12,
              marginTop: 7,
              color: "#CCCCCC",
            }}
          >
            Phone: {shop?.shop_phone}
          </Text>
        </View>
        {/* <View style={{ paddingRight: 20 }}>
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
        </View> */}
      </Pressable>
    );
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          width: isDesktopOrLaptop ? "40%" : "100%",
          alignSelf: "center",
        }}
      >
        <TextInput
          style={styles.searchBar}
          placeholder="Search for nearby shops..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={handleSearch}
        />
        {filteredShops.length === 0 ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white" }}>No Shops Found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredShops}
            keyExtractor={(item) => item.shop_id}
            renderItem={({ item }) => renderListItem({ shop: item })}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "black",
  },
  searchBar: {
    paddingVertical: "4%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    color: "white",
    marginBottom: 15,
  },
  shopItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  shopText: {
    color: "white",
    fontSize: 18,
  },
  listStyle: {
    // height: 75,
    paddingVertical: "4%",
    width: "100%",
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
  listItemName: { color: "white", fontSize: 16, marginLeft: 20 },
  listItemPrice: { color: "white", fontSize: 18 },
  listItemStatus: { fontSize: 14, textAlign: "center" },
});

export default ShopsScreen;
