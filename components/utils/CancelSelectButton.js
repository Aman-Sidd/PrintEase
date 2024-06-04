import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

const CancelSelectButtons = ({
  onCancelPress,
  onSelectPress,
  containerStyle,
  selectButtonText = "Select",
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable onPress={onCancelPress} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel&nbsp;</Text>
      </Pressable>
      <Pressable onPress={onSelectPress} style={styles.selectButton}>
        <Text style={styles.selectButtonText}>{selectButtonText}&nbsp;</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  cancelButton: {
    width: 143,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    backgroundColor: "black",
  },
  selectButton: {
    width: 143,
    borderRadius: 8,
    height: 44,
    backgroundColor: "#B0B5C9",
    justifyContent: "center",
  },
  selectButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
});

export default CancelSelectButtons;
