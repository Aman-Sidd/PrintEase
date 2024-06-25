import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useDebugValue, useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientText from "../../components/formUtils/GradientText";
import { Divider } from "@rneui/base";
import { useNavigation, useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import InputText from "../../components/formUtils/InputText";
import { useDispatch, useSelector } from "react-redux";
import { add_user, fetchUser, login_user } from "../../redux/UserSlice";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/utils/LoadingScreen";
import AsyncStorage from "@react-native-community/async-storage";
import { USER_TYPE } from "../../constants/USER_TYPE";
import { useMediaQuery } from "react-responsive";
import { addExpoPushToken, setIsDesktop } from "../../redux/UtilSlice";

import { updateUserDetails } from "../../api/methods/updateUserDetails";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  console.log(user);
  console.log(email);
  console.log(password);
  const isDesktop = useSelector((state) => state.util.isDesktop);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  useEffect(() => {
    const checkForAuthToken = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const user_type = await AsyncStorage.getItem("user_type");
        if (user_type === USER_TYPE.OWNER) {
          navigation.replace("OwnerTab");
          return;
        }
        if (user_type === USER_TYPE.CUSTOMER) {
          navigation.replace("Main");
          return;
        }
      }
      setLoading(false);
    };

    dispatch(setIsDesktop(isDesktopOrLaptop));
    checkForAuthToken();
  }, []);

  const fetchUser = async (payload) => {
    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("email", payload.email);
      formData.append("pass", payload.password);

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      console.log("inside fetchUser");
      const response = await myApi.post("/login", formData, config);
      const user = response.data;
      console.log("USER in login screen:", user);
      console.log("RESPONSE:", response.data);
      if (response.data.user_found == "0") {
        Alert.alert("Error!", "Invalid email or password");
        return;
      }
      await AsyncStorage.setItem("authToken", user.JWT_TOKEN);
      await AsyncStorage.setItem("user_type", user.user_type);

      const fetchUserDetails = await myApi.get("/common/get-user-details");
      const userDetails = fetchUserDetails.data;
      console.log("USER:", userDetails);

      dispatch(add_user(fetchUserDetails.data));
      setLoading(false);
      if (user.user_type == USER_TYPE.CUSTOMER) navigation.navigate("Shops");
      else if (user.user_type == USER_TYPE.OWNER)
        navigation.replace("OwnerTab");
    } catch (err) {
      console.log("Error while fetching user details: ", err);
      Alert.alert("Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.mainContainer,
            Platform.OS == "web" && {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={
              isDesktop
                ? styles.container
                : { width: "90%", alignSelf: "center" }
            }
          >
            <View>
              <View style={{ alignItems: "center" }}>
                <GradientText style={{ fontSize: 45 }} text="PrintEase" />
                <Text style={{ color: "white" }}>
                  From click to print, Seamlessly
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <InputText
                  keyboardType="email"
                  state={{ email, password }}
                  actions={{ setEmail, setPassword }}
                />
                <InputText
                  keyboardType="password"
                  state={{ email, password }}
                  actions={{ setEmail, setPassword }}
                />
              </View>
            </View>
            <Pressable
              onPress={() => navigation.replace("Register")}
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "gray", fontSize: 15 }}>
                Didn't have an Account?
              </Text>
              <Text
                style={{ color: "#BEBEBE", fontWeight: "500", fontSize: 15 }}
              >
                &nbsp;Sign Up Instead!
              </Text>
            </Pressable>
            <View style={styles.footerContainer}>
              {email && password ? (
                <Pressable onPress={() => fetchUser({ email, password })}>
                  {Platform.OS !== "web" ? (
                    <LinearGradient
                      colors={[
                        "rgba(138, 212, 236, 0.8)",
                        "rgba(239, 150, 255, 0.8)",
                        "rgba(255, 86, 169, 0.8)",
                        "rgba(255, 170, 108, 0.8)",
                      ]}
                      style={styles.linearGradButton}
                      start={{ x: 0, y: 0 }}
                    >
                      <Text style={styles.linearGradButtonText}>Login</Text>
                    </LinearGradient>
                  ) : (
                    <Pressable
                      style={styles.fadedButtonStyle}
                      onPress={() => fetchUser({ email, password })}
                    >
                      <Text style={styles.linearGradButtonText}>Login</Text>
                    </Pressable>
                  )}
                </Pressable>
              ) : (
                <Pressable style={styles.fadedButtonStyle}>
                  <Text style={styles.fadedButtonText}>Login</Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#080A0C",
  },
  container: {
    width: "30%",
    alignSelf: "center",
  },
  inputContainer: {
    alignItems: "center",
    gap: 15,
    marginTop: 50,
    marginBottom: 40,
  },
  textInput: {
    width: "85%",
    height: 64,
    color: "white",
    borderColor: "#405064",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  thirdPartyContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
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
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 35,
    marginTop: 20,
  },
  footerContainer: {
    marginBottom: 50,
    marginHorizontal: 40,
    // justifyContent: "flex-end",
    marginTop: 100,
    flex: 1,
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
    color: "#405064",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
});
