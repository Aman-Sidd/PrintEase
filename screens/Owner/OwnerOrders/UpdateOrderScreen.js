import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, RadioButton } from "react-native-paper";
import {
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
} from "../../../constants/ORDER_STATUS";

const UpdateOrderScreen = ({ navigation, route }) => {
  const { order_id, curr_order_status } = route.params;
  const [value, setValue] = React.useState(curr_order_status);

  const handleUpdateButton = () => {
    if (value === "Picked") {
      navigation.replace("Camera", { order_id, curr_order_status });
      return;
    }
    console.log("Update Button Pressed!");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <View style={{ backgroundColor: "black", width: "90%" }}>
        <RadioButton.Group
          onValueChange={(value) => setValue(value)}
          value={value}
        >
          <RadioButton.Item
            labelStyle={{ color: "white", fontSize: 18 }}
            label={ORDER_STATUS_PENDING}
            value={ORDER_STATUS_PENDING}
          />
          <RadioButton.Item
            labelStyle={{ color: "white", fontSize: 18 }}
            label={ORDER_STATUS_READY}
            value={ORDER_STATUS_READY}
          />
          <RadioButton.Item
            labelStyle={{ color: "white", fontSize: 18 }}
            label={ORDER_STATUS_PICKED}
            value={ORDER_STATUS_PICKED}
          />
        </RadioButton.Group>
      </View>

      <Button
        style={{ marginTop: 20 }}
        mode="contained"
        onPress={handleUpdateButton}
      >
        Update
      </Button>
    </SafeAreaView>
  );
};

export default UpdateOrderScreen;

const styles = StyleSheet.create({});
