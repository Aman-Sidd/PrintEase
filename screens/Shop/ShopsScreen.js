import React, { useState } from "react";
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
import { add_shop, add_user } from "../../redux/UserSlice";
import { useNavigation } from "@react-navigation/native";
import { useMediaQuery } from "react-responsive";
import { setShopId } from "../../redux/OrderSlice";

const demoShops = [
  { id: 1, name: "Kumar Photocopy", address: "Integral University" },
];

const ShopsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredShops, setFilteredShops] = useState(demoShops);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      let filtered = demoShops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(text.toLowerCase()) ||
          shop.address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredShops(filtered);
    } else {
      setFilteredShops(demoShops);
    }
  };

  const renderListItem = ({ shop }) => {
    return (
      <Pressable
        onPress={() => {
          dispatch(setShopId({ shopId: shop?.id }));
          navigation.navigate("Main");
        }}
        style={styles.listStyle}
      >
        <View style={{ maxWidth: "70%" }}>
          <Text numberOfLines={1} style={styles.listItemName}>
            {shop?.name}
          </Text>
          <Text
            style={{
              ...styles.listItemName,
              fontSize: 12,
              marginTop: 7,
              color: "#CCCCCC",
            }}
          >
            {shop?.address}
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

  return (
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
            keyExtractor={(item) => item.id}
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
