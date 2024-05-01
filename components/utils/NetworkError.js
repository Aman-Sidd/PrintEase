import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NetworkError = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>Network Error</Text>
      <Text style={styles.instructions}>
        Please check your internet connection and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222", // Dark background color
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 24,
    color: "#fff", // White font color
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: "#fff", // White font color
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default NetworkError;
