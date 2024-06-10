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
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientText from "../../components/formUtils/GradientText";
import { Divider } from "@rneui/base";
import { useTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { add_user, registerUser } from "../../redux/UserSlice";
import InputText from "../../components/formUtils/InputText";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/utils/LoadingScreen";
import { useMediaQuery } from "react-responsive";
import { ScrollView } from "react-native-gesture-handler";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const dispatch = useDispatch();

  const registerUser = async (payload) => {
    try {
      setLoading(true);
      const registerFormData = new URLSearchParams();
      registerFormData.append("username", payload.name);
      registerFormData.append("email", payload.email);
      registerFormData.append("pass", payload.password);
      registerFormData.append("phone", payload.phone);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const response = await myApi.post("/register", registerFormData, config);
      console.log("RESPONSE:", response);
      // dispatch(add_user({ ...payload, token }));
      if (Platform.OS !== "web")
        Alert.alert("Successful", "You are registered successfully!");
      else alert("Successful! You are registered successfully!");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err) {
      console.log(
        "Something went wrong while creating user! ",
        err.response.data
      );
      if (Platform.OS !== "web")
        Alert.alert("Email already exist!", "Please! Choose another email.");
      else alert("Email already exist. Try another email.");
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
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <View style={isDesktop ? styles.container : null}>
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
              {/* <View style={styles.thirdPartyContainer}>
                <Divider
                  style={{ width: "20%" }}
                  color="gray"
                  width={1}
                  orientation="horizontal"
                />

                <Text style={{ color: "gray", marginHorizontal: 15 }}>
                  or sign up with
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
              </View> */}
            </View>
            <Pressable
              onPress={() => navigation.replace("Login")}
              style={{
                // marginLeft: 40,
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "gray", fontSize: 15 }}>
                Already have an Account?
              </Text>
              <Text
                style={{ color: "#BEBEBE", fontWeight: "500", fontSize: 15 }}
              >
                &nbsp;Log In Instead!
              </Text>
            </Pressable>

            <View
              style={[styles.footerContainer, isDesktop && { marginTop: 40 }]}
            >
              {email && password && phone && name ? (
                <Pressable
                  onPress={() => registerUser({ email, password, phone, name })}
                >
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
                      <Text style={styles.linearGradButtonText}>Sign up</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.fadedButtonStyle}>
                      <Text style={styles.linearGradButtonText}>Sign up</Text>
                    </View>
                  )}
                </Pressable>
              ) : (
                <Pressable style={styles.fadedButtonStyle}>
                  <Text style={styles.fadedButtonText}>Sign up</Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    marginBottom: 20,
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
    marginTop: 10,
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
