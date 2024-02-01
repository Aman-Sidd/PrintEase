import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientText from "../components/GradientText";
import { Divider } from "@rneui/base";
import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { add_user, registerUser } from "../redux/UserSlice";
import InputText from "../components/InputText";
import myApi from "../api/myApi";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();

  const users = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(users);
  console.log(name);
  console.log(email);
  console.log(password);
  console.log(phone);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
              keyboardType="name"
              state={{ email, password, name, phone }}
              actions={{ setName, setEmail, setPassword, setPhone }}
            />
            <InputText
              keyboardType="email"
              state={{ email, password, name, phone }}
              actions={{ setName, setEmail, setPassword, setPhone }}
            />
            <InputText
              keyboardType="password"
              state={{ email, password, name, phone }}
              actions={{ setName, setEmail, setPassword, setPhone }}
            />
            <InputText
              keyboardType="phone"
              state={{ email, password, name, phone }}
              actions={{ setName, setEmail, setPassword, setPhone }}
            />
          </View>
          <View style={styles.thirdPartyContainer}>
            <Divider
              style={{ width: "20%" }}
              color="#FFFFFF"
              width={1}
              orientation="horizontal"
            />

            <Text style={{ color: "white", marginHorizontal: 15 }}>
              or sign up with
            </Text>

            <Divider
              style={{ width: "20%" }}
              color="#FFFFFF"
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

        <View style={styles.footerContainer}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: "#8398AF" }}>
              By proceeding, you agree to these Term and Conditions.
            </Text>
          </View>

          {email && password ? (
            <Pressable
              onPress={async () => {
                const user = await registerUser({
                  name,
                  email,
                  password,
                  phone,
                });
                dispatch(add_user(user));
              }}
            >
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
                <Text style={styles.linearGradButtonText}>Sign up</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <Pressable style={styles.fadedButtonStyle}>
              <Text style={styles.fadedButtonText}>Sign up</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
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
    marginTop: 80,
    // justifyContent: "flex-end",
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
