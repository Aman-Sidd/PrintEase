import React from "react";
import { Text, StyleSheet } from "react-native";

const UnderlinedText = ({ children, style }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    textDecorationLine: "underline",
    color: "white",
    // You can add other text styles here if needed
  },
});

export default UnderlinedText;
