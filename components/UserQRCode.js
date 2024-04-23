import { StyleSheet, Text, View } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";

const OrderQRCode = ({ orderId }) => {
  return (
    <View>
      <QRCode value={orderId} size={120} />
    </View>
  );
};

export default OrderQRCode;

const styles = StyleSheet.create({});
