import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";
import { setPageSize } from "../../redux/OrderSlice";
import { isDesktop } from "../../hooks/isDesktop";
import { useMediaQuery } from "react-responsive";

const data = [
  { label: "A4", value: "1" },
  // { label: "A2", value: "2" },
  // { label: "A3", value: "3" },
  // { label: "A4", value: "4" },
];

const PageSizeDropdown = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const dispatch = useDispatch();

  const isPC = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            isPC && { top: 0 },
            isFocus && { color: "#6A84A0" },
          ]}
        >
          Page Size
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={{ ...styles.container, padding: isPC ? 8 : 16 }}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          isPC && Platform.OS === "web" && { height: 50 },
          !isPC && Platform.OS === "web" && { height: 55 },
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
        placeholder={!isFocus ? "Select Page Size" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          dispatch(setPageSize({ pageSize: item.label }));
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

export default PageSizeDropdown;

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
    height: 55,
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
    color: "white",
    fontSize: 16,
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
