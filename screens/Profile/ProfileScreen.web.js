import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Button } from "react-native-paper";
import LoadingScreen from "../../components/utils/LoadingScreen";
import { getUserDetails } from "../../api/methods/getUserDetails";
import { isDesktop } from "../../hooks/isDesktop";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    console.log("KEYS:", keys);
    await AsyncStorage.multiRemove(keys);
    navigation.replace("Login");
  };
  console.log("USER", user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserDetails();
        console.log("RESPONSE:", response);
        setUser(response);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  let isPC = isDesktop();

  const userType = user?.user_type === "0" ? "Owner" : "Customer";

  return loading ? (
    <LoadingScreen />
  ) : (
    <View style={styles.container}>
      <View style={{ ...styles.innerContainer, width: isPC ? "30%" : "90%" }}>
        <Text style={styles.label}>Name: {user?.username + " "}</Text>
        {/* <Text style={styles.value}>{user.username + " "}</Text> */}

        <Text style={styles.label}>Email: {user?.email + " "}</Text>
        {/* <Text style={styles.value}>{user.email + " "}</Text> */}

        <Text style={styles.label}>Phone Number: {user?.phone + " "}</Text>
        {/* <Text style={styles.value}>{user.phone + " "}</Text> */}

        <Text style={styles.label}>User Type: {userType + " "}</Text>
        {/* <Text style={styles.value}>{userType + " "}</Text> */}

        <Button
          style={styles.listStyle}
          mode="contained"
          onPress={handleLogout}
        >
          <Text style={styles.listItemName}>Logout &nbsp;</Text>
        </Button>
      </View>
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
  innerContainer: {
    gap: 15,
    width: "30%",
    justifyContent: "center",
    marginTop: "2%",
    borderRadius: 10,
    alignSelf: "center",
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "black",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    marginBottom: 5,
  },
  value: {
    color: "white",
    fontSize: 16,
    marginBottom: 15,
  },
});
