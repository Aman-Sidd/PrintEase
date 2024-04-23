import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation, useTheme } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const handleLogout = async () => {
    const token = await AsyncStorage.getItem("authToken");
    await AsyncStorage.removeItem("authToken");
    console.log("Deleted token: ", token);
    navigation.replace("Login");
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Pressable onPress={handleLogout} style={styles.listStyle}>
        <Text style={styles.listItemName}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  listStyle: {
    height: 75,
    width: "40%",
    borderRadius: 8,
    // marginLeft: 8,
    alignSelf: "center",
    backgroundColor: "#202020",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listItemName: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
});
