import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Button } from "react-native-paper";
import LoadingScreen from "../../components/utils/LoadingScreen";
import {
  getUserDetails,
  getUserDetailsById,
} from "../../api/methods/getUserDetails";
import { isDesktop } from "../../hooks/isDesktop";
import { ScrollView } from "react-native-gesture-handler";
import { updateUserDetails } from "../../api/methods/updateUserDetails";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.data);
  const expoPushToken = useSelector((state) => state.util.expoPushToken);
  const [loading, setLoading] = useState(true);

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
      alert("Something went wrong. Try Again!");
      console.log("Error occurred while logging out.", err);
    } finally {
      setLoading(false);
    }
  };
  console.log("USER", user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserDetails();
        console.log("RESPONSE:", response);
        setUser(response);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  let isPC = isDesktop();

  const userType = user?.user_type === "0" ? "Owner" : "Customer";

  return loading ? (
    <LoadingScreen />
  ) : (
    <ScrollView style={{ flex: 1, backgroundColor: "black", paddingTop: 50 }}>
      <View style={styles.container}>
        <View style={{ ...styles.innerContainer, width: isPC ? "30%" : "90%" }}>
          <View style={styles.detailsContainer}>
            <Text style={styles.containerTitle}>Personal Details:</Text>

            <Text style={styles.label}>
              Name: <Text style={styles.value}>{user?.username + " "}</Text>
            </Text>

            <Text style={styles.label}>
              Email: <Text style={styles.value}>{user?.email + " "}</Text>
            </Text>

            <Text style={styles.label}>
              Phone Number:{" "}
              <Text style={styles.value}>{user?.phone + " "}</Text>
            </Text>

            <Text style={styles.label}>
              User Type: <Text style={styles.value}>{userType + " "}</Text>
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.containerTitle}>Contact for any query:</Text>

            <Text style={styles.contactLabel}>
              Email:{" "}
              <Text style={styles.contactValue}>
                printease.official@gmail.com
              </Text>
            </Text>

            <Text style={styles.contactLabel}>
              Phone Number:{" "}
              <View>
                <Text style={[styles.contactValue, { marginBottom: 2 }]}>
                  +91 93697 76397{" "}
                </Text>
                <Text style={styles.contactValue}>+91 87565 16427</Text>
              </View>
            </Text>
          </View>

          <Button
            style={styles.listStyle}
            mode="contained"
            onPress={handleLogout}
          >
            <Text style={styles.listItemName}>Logout &nbsp;</Text>
          </Button>
        </View>
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
  innerContainer: {
    gap: 15,
    width: "30%",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#1E1E1E",
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
  container: {},
  label: {
    fontSize: 18,
    color: "#AAAAAA",
    fontWeight: "500",
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
