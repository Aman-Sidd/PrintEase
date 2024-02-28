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
import React, { useDebugValue, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientText from "../components/GradientText";
import { Divider } from "@rneui/base";
import { useNavigation, useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import InputText from "../components/InputText";
import { useDispatch, useSelector } from "react-redux";
import { add_user, fetchUser, login_user } from "../redux/UserSlice";
import myApi from "../api/myApi";
import LoadingScreen from "../components/LoadingScreen";
import AsyncStorage from "@react-native-community/async-storage";

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
  const fetchUser = async (payload) => {
    try {
      setLoading(true);
      const response = await myApi.post("/signin", payload);
      const user = response.data;
      await AsyncStorage.setItem("authToken", user.token);
      dispatch(add_user(user));
      setLoading(false);
      navigation.replace("Main");
    } catch (err) {
      console.log("Error while fetching user details: ", err.response.data);
      Alert.alert("Error", err.response.data.message);
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
        <SafeAreaView style={styles.mainContainer}>
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
            <View style={styles.thirdPartyContainer}>
              <Divider
                style={{ width: "20%" }}
                color="gray"
                width={1}
                orientation="horizontal"
              />

              <Text style={{ color: "gray", marginHorizontal: 15 }}>
                or sign in with
              </Text>

              <Divider
                style={{ width: "20%" }}
                color="gray"
                width={1}
                orientation="horizontal"
              />
            </View>

            <View style={styles.logoContainer}>
              <AntDesign name="google" size={24} color="#959595" />
              <FontAwesome5 name="facebook" size={24} color="#959595" />
              <AntDesign name="apple1" size={24} color="#959595" />
            </View>
          </View>
          <Pressable
            onPress={() => navigation.replace("Register")}
            style={{
              marginLeft: 40,
              marginTop: 30,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: "gray", fontSize: 15 }}>
              Didn't have an Account?
            </Text>
            <Text style={{ color: "#BEBEBE", fontWeight: "500", fontSize: 15 }}>
              &nbsp;Sign Up Instead!
            </Text>
          </Pressable>
          <View style={styles.footerContainer}>
            {email && password ? (
              <Pressable onPress={() => fetchUser({ email, password })}>
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
              </Pressable>
            ) : (
              <Pressable style={styles.fadedButtonStyle}>
                <Text style={styles.fadedButtonText}>Login</Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#080A0C",
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
    marginTop: 190,
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
