import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Button } from "react-native-paper";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const user = useSelector((state) => state.user);
  console.log("User", user);

  const handleLogout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    navigation.replace("Login");
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Button style={styles.listStyle} mode="contained" onPress={handleLogout}>
        <Text style={styles.listItemName}>Logout &nbsp;</Text>
      </Button>
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
    // height: 75,
    // width: "40%",
    // borderRadius: 8,
    // marginLeft: 8,
    alignSelf: "center",
    // backgroundColor: "#202020",
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
