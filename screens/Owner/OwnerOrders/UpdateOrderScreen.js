import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import {
  getUserDetails,
  getUserDetailsById,
} from "../../../api/methods/getUserDetails";
import axios from "axios";
import { updateOrderStatus } from "../../../api/methods/updateOrderStatus";
import { sendPushNotification } from "../../../api/methods/sendPushNotification";

const UpdateOrderScreen = ({ navigation, route }) => {
  const { order_id, curr_order_status, user_id } = route.params;
  console.log("user_id:", user_id);
  const [value, setValue] = useState(curr_order_status);
  const [loading, setLoading] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const handleUpdateButton = async () => {
    try {
      setLoading(true);
      if (value === ORDER_STATUS_PICKED) {
        navigation.replace("Camera", { order_id, curr_order_status, user_id });
        return;
      } else if (value === ORDER_STATUS_READY) {
        const response = updateOrderStatus({ order_id, order_status: 1 });
        console.log("update-order-status Resp:", response);
        await sendPushNotification({
          user_id,
          message: "Your Order Has Been Printed. Collect it ASAP!",
        });

        navigation.pop();
        if (Platform.OS !== "web")
          Alert.alert("Success", "Order status has been changed.");
      } else if (value === ORDER_STATUS_PENDING) {
        const response = updateOrderStatus({ order_id, order_status: 0 });
        await sendPushNotification({
          user_id,
          message: "Your Order Status is Pending!",
        });
        console.log("update-order-status Resp:", response);

        navigation.pop();

        if (Platform.OS !== "web")
          Alert.alert("Success", "Order status has been changed.");
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
