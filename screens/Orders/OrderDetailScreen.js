import { StyleSheet } from "react-native";
import React from "react";
import OrderDetails from "../../components/orderDetails/OrderDetails";

const OrderDetailScreen = ({ navigation, route }) => {
  const { order_id, _id } = route.params;

  return <OrderDetails order_id={order_id} isOwner={false} _id={_id} />;
};

export default OrderDetailScreen;

const styles = StyleSheet.create({});
