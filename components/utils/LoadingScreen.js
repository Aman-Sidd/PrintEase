import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";

const LoadingScreen = () => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FFA500" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#080A0C",
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default LoadingScreen;
