import React from "react";
import { View, StyleSheet } from "react-native";

const CurvedRectangle = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rectangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rectangle: {
    width: 250,
    height: 200,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    opacity: 0.7,
  },
});

export default CurvedRectangle;
