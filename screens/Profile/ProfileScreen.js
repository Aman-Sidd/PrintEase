import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Button } from "react-native-paper";
import { getUserDetailsById } from "../../api/methods/getUserDetails";
import { updateUserDetails } from "../../api/methods/updateUserDetails";
import LoadingScreen from "../../components/utils/LoadingScreen";
import { ScrollView } from "react-native-gesture-handler";

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

      const pushTokens = JSON.parse(userDetails.push_token)?.filter(
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
    <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <Text style={styles.containerTitle}>Personal Details:</Text>
          <Text style={styles.label}>Name: </Text>
          <Text style={styles.value}>{user?.username + " "}</Text>

          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{user?.email + " "}</Text>

          <Text style={styles.label}>Phone Number: </Text>
          <Text style={styles.value}>{user?.phone + " "}</Text>

          <Text style={styles.label}>User Type: </Text>
          <Text style={styles.value}>{userType + " "}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.containerTitle}>Contact for any query:</Text>

          <Text style={styles.contactLabel}>Email:</Text>
          <Text style={styles.contactValue}>printease.official@gmail.com</Text>

          <Text style={styles.contactLabel}>Phone Number:</Text>
          <Text style={styles.contactValue}>+91 93697 76397</Text>
          <Text style={styles.contactValue}>+91 87565 16427</Text>
        </View>

        <Button
          style={styles.listStyle}
          mode="contained"
          onPress={handleLogout}
        >
          <Text style={styles.listItemName}>Logout &nbsp;</Text>
        </Button>
      </View>
    </ScrollView>
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
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  listItemName: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "black",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    color: "white",
    fontSize: 16,
    marginBottom: 15,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    width: "100%",
  },
  containerTitle: {
    fontSize: 18,
    color: "#FFA500",
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 5,
  },
  contactLabel: {
    fontSize: 16,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  contactValue: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});
