import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";
import { setPageSize, setPrintType } from "../../redux/OrderSlice";

const data = [
  { label: "Single Sided", value: "1" },
  { label: "Both Sided", value: "2" },
];

const PrintTypeDropdown = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "#6A84A0" }]}>
          Print Type
        </Text>
      );
    }
    return null;
  };
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "white" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        containerStyle={styles.containerStyle}
        itemTextStyle={styles.itemTextStyle}
        labelField="label"
        activeColor="grey"
        valueField="value"
        placeholder={!isFocus ? "Select Print Type" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          dispatch(setPrintType({ printType: item.label }));
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

export default PrintTypeDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    padding: 16,
  },
  dropdown: {
    height: 65,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  containerStyle: {
    backgroundColor: "black",
  },
  itemTextStyle: {
    color: "white",
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
