import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientText from "../../components/formUtils/GradientText";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import myApi from "../../api/myApi";
import { useDispatch, useSelector } from "react-redux";
import { add_user } from "../../redux/UserSlice";
import { USER_TYPE } from "../../constants/USER_TYPE";
import LoadingScreen from "../../components/utils/LoadingScreen";
import { getUserDetails } from "../../api/methods/getUserDetails";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { useMediaQuery } from "react-responsive";

const WelcomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkForAuthToken = async () => {
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const user = await getUserDetails();
        console.log(user);
        if (user.success) {
          dispatch(add_user(user));
          if (user.user_type === USER_TYPE.OWNER) {
            navigation.replace("OwnerTab");
          }
          if (user.user_type === USER_TYPE.CUSTOMER) {
            navigation.replace("Main");
          }
        }
      }
      setLoading(false);
    };
    checkForAuthToken();
  }, []);
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <GradientText style={{ fontSize: 45 }} text="PrintEase" />
          <Text style={{ color: "white" }}>
            From click to print, Seamlessly
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={[
              styles.imageStyle,
              !isDesktopOrLaptop && { width: 170, height: 170 },
            ]}
            source={require("../../assets/printer.png")}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
        </View>
      </View>

      <View
        style={[styles.footerContainer, !isDesktopOrLaptop && { width: "80%" }]}
      >
        <Pressable
          style={styles.fadedButtonStyle}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.fadedButtonText}>Login</Text>
        </Pressable>
        <Pressable
          style={{ ...styles.fadedButtonStyle, backgroundColor: "#454f84" }}
          onPress={() => navigation.replace("Register")}
        >
          <Text style={styles.linearGradButtonText}>Sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#080A0C",
    alignItems: "center",
  },
  imageStyle: {
    height: 200,
    width: 200,
  },
  imageContainer: {
    justifyContent: "center",
    marginTop: 50,
    alignItems: "center",
  },

  fadedButtonStyle: {
    backgroundColor: "#28323E",
    height: 50,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
  },

  footerContainer: {
    marginBottom: 50,
    marginHorizontal: 20,
    justifyContent: "flex-end",
    width: "25%",
    flex: 1,
    gap: 10,
  },
  linearGradButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  linearGradButton: {
    height: 50,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  fadedButtonText: {
    color: "#EAEAEA",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
});
