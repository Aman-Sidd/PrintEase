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

const styles = StyleSheet.create({});
