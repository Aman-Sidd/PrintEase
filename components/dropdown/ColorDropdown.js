import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { setColor } from "../../redux/OrderSlice";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";

const data = [
  { label: "Black & White", value: "1" },
  { label: "Coloured", value: "2" },
];

const ColorDropdown = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const dispatch = useDispatch();
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "#6A84A0" }]}>
          Color
        </Text>
      );
    }
    return null;
  };
  const isPC = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  return (
    <View style={{ ...styles.container, padding: isPC ? 8 : 16 }}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          !isPC && Platform.OS === "web" && { height: 45 },
          isFocus && { borderColor: "white" },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        containerStyle={styles.containerStyle}
        itemTextStyle={styles.itemTextStyle}
        labelField="label"
        valueField="value"
        activeColor="grey"
        placeholder={!isFocus ? "Select Color" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          dispatch(setColor({ color: item.label }));
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "white" : "white"}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default ColorDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    padding: 16,
  },
  containerStyle: {
    backgroundColor: "black",
  },
  itemTextStyle: {
    color: "white",
  },
  dropdown: {
    height: 65,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "black",
    left: 22,
    color: "#6A84A0",
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
