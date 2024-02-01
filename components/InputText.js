import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const InputText = ({ keyboardType, state, actions }) => {
  const { email, password, name, phone } = state;
  const { setName, setEmail, setPassword, setPhone } = actions;
  if (keyboardType === "email")
    return (
      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        style={styles.textInput}
        placeholder="Email"
        placeholderTextColor={"#6A84A0"}
        autoCapitalize="none"
        keyboardType="email-address"
      />
    );
  if (keyboardType === "password")
    return (
      <TextInput
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        secureTextEntry
        style={styles.textInput}
        placeholder="Password"
        placeholderTextColor={"#6A84A0"}
      />
    );
  if (keyboardType === "name")
    return (
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
        secureTextEntry
        style={styles.textInput}
        placeholder="Name"
        placeholderTextColor={"#6A84A0"}
      />
    );
  if (keyboardType === "phone")
    return (
      <TextInput
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
        }}
        style={styles.textInput}
        placeholder="Phone Number"
        placeholderTextColor={"#6A84A0"}
      />
    );
};

export default InputText;

const styles = StyleSheet.create({
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
});
