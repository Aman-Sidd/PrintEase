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
import LoadingScreen from "../../../components/LoadingScreen";
import UnderlinedText from "../../../components/UnderlinedText";
import myApi from "../../../api/myApi";
import { RATE16_25, RATE1_15, RATE26Above } from "../../../constants/PRICING";
import {
  COLOR_ORDER_STATUS_PENDING,
  COLOR_ORDER_STATUS_PICKED,
  COLOR_ORDER_STATUS_READY,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
} from "../../../constants/ORDER_STATUS";
import { Button } from "react-native-paper";
import OrderDetails from "../../../components/OrderDetails/OrderDetails";

const OwnerOrderDetailScreen = ({ navigation, route }) => {
  const { order_id } = route.params;
  return <OrderDetails order_id={order_id} isOwner={true} />;
};

export default OwnerOrderDetailScreen;

const styles = StyleSheet.create({
  checkoutInfo: {
    gap: 15,
    // width: "80%",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    backgroundColor: "#1E1E1E",
    // backgroundColor: "red",
  },
  textStyle: {
    fontWeight: "500",
    color: "white",
    fontSize: 18,
    color: "#AAAAAA",
  },
});
