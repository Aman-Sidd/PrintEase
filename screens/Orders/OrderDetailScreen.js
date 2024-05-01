import { StyleSheet } from "react-native";
import React from "react";
import OrderDetails from "../../components/orderDetails/OrderDetails";

const OrderDetailScreen = ({ navigation, route }) => {
  const { order_id } = route.params;

  return <OrderDetails order_id={order_id} isOwner={false} />;
};

export default OrderDetailScreen;

const styles = StyleSheet.create({});
