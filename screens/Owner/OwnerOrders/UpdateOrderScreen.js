import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, RadioButton } from "react-native-paper";
import {
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_READY,
} from "../../../constants/ORDER_STATUS";
import myApi from "../../../api/myApi";
import LoadingScreen from "../../../components/utils/LoadingScreen";
import { useMediaQuery } from "react-responsive";

const UpdateOrderScreen = ({ navigation, route }) => {
  const { order_id, curr_order_status } = route.params;
  const [value, setValue] = useState(curr_order_status);
  const [loading, setLoading] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const handleUpdateButton = async () => {
    try {
      setLoading(true);
      if (value === ORDER_STATUS_PICKED) {
        navigation.replace("Camera", { order_id, curr_order_status });
        return;
      } else if (value === ORDER_STATUS_READY) {
        const formData = new URLSearchParams();
        formData.append("order_id", order_id);
        formData.append("order_status", 1);

        const config = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
        const response = await myApi.post(
          "/owner/update-order-status",
          formData,
          config
        );
        console.log("update-order-status Resp:", response.data);
        alert("Order status has been changed.");
      } else if (value === ORDER_STATUS_PENDING) {
        const formData = new URLSearchParams();
        formData.append("order_id", order_id);
        formData.append("order_status", 0);
        const config = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
        const response = await myApi.post(
          "/owner/update-order-status",
          formData,
          config
        );
        console.log("update-order-status Resp:", response.data);
        const alertObj = {
          title: "Success",
          message: "Order has been changed.",
        };
        alert("Order status has been changed.");
      }
    } catch (err) {
      console.log(err);
      alert("Status cannot be updated, Try Again!");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black", alignItems: "center" }}
    >
      <View
        style={{
          backgroundColor: "black",
          width: isDesktopOrLaptop ? "30%" : "90%",
        }}
      >
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
