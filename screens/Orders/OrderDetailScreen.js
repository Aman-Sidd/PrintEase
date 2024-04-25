import {
  Button,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/LoadingScreen";
import { RATE16_25, RATE1_15, RATE26Above } from "../../constants/PRICING";
import UnderlinedText from "../../components/UnderlinedText";
import SvgQRCode from "react-native-qrcode-svg";
import UserQRCode from "../../components/UserQRCode";
import OrderQRCode from "../../components/UserQRCode";
import {
  COLOR_ORDER_STATUS_PENDING,
  COLOR_ORDER_STATUS_PICKED,
  COLOR_ORDER_STATUS_READY,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
} from "../../constants/ORDER_STATUS";
import OrderDetails from "../../components/OrderDetails/OrderDetails";

const OrderDetailScreen = ({ navigation, route }) => {
  const { order_id } = route.params;

  return <OrderDetails order_id={order_id} isOwner={false} />;
};

export default OrderDetailScreen;

const styles = StyleSheet.create({});
