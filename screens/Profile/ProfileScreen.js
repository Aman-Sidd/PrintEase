import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Button } from "react-native-paper";
import {
  getUserDetails,
  getUserDetailsById,
} from "../../api/methods/getUserDetails";
import { updateUserDetails } from "../../api/methods/updateUserDetails";
import LoadingScreen from "../../components/utils/LoadingScreen";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.data);
  const expoPushToken = useSelector((state) => state.util.expoPushToken);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log("Handling logout");

      const response = (await getUserDetailsById(user?.user_id)).data;
      const userDetails = response.data;
      console.log("userDetails:", userDetails);

      const pushTokens = JSON.parse(userDetails.push_token).filter(
        (token) => token !== expoPushToken
      );
      console.log("expoPushToken:", expoPushToken);
      console.log("pushTokens:", pushTokens);
      await updateUserDetails({ userDetails, pushTokens });

      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);

      navigation.replace("Login");
    } catch (err) {
      console.log("Error occurred while logging out.", err);
    } finally {
      setLoading(false);
    }
  };

  const userType = user?.user_type === "0" ? "Owner" : "Customer";

  return loading ? (
    <LoadingScreen />
  ) : (
    <View style={styles.container}>
      <Text style={styles.label}>Name: </Text>
      <Text style={styles.value}>{user.username + " "}</Text>

      <Text style={styles.label}>Email: </Text>
      <Text style={styles.value}>{user.email + " "}</Text>

      <Text style={styles.label}>Phone Number: </Text>
      <Text style={styles.value}>{user.phone + " "}</Text>

      <Text style={styles.label}>User Type: </Text>
      <Text style={styles.value}>{userType + " "}</Text>

      <Button style={styles.listStyle} mode="contained" onPress={handleLogout}>
        <Text style={styles.listItemName}>Logout &nbsp;</Text>
      </Button>
    </View>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "black",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    color: "white",
    fontSize: 16,
    marginBottom: 15,
  },
});
