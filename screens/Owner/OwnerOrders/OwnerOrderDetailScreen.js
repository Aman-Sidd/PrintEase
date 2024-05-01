import { StyleSheet } from "react-native";
import React from "react";
import OrderDetails from "../../../components/orderDetails/OrderDetails";

const OwnerOrderDetailScreen = ({ route }) => {
  const { order_id } = route.params;
  return <OrderDetails order_id={order_id} isOwner={true} />;
};

export default OwnerOrderDetailScreen;

const styles = StyleSheet.create({});
