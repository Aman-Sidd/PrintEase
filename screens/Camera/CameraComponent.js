import { CameraView, useCameraPermissions } from "expo-camera/next";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import CurvedRectangle from "../../components/utils/CurvedRectangle";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/utils/LoadingScreen";
import { ORDER_STATUS_PICKED } from "../../constants/ORDER_STATUS";
import { Button } from "react-native-paper";

const CameraComponent = ({ navigation, route }) => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [enableTorch, setEnableTorch] = useState(false);

  const { order_id, curr_order_status } = route.params;

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", fontSize: 18, color: "white" }}>
          We need your permission to show the camera
        </Text>
        <Button
          style={{ marginTop: 20 }}
          mode="contained"
          onPress={requestPermission}
        >
          Allow Permission
        </Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleScannedBarcode = async ({ data }) => {
    try {
      setLoading(true);
      if (order_id === data) {
        // Hit the api to update the status to PICKED

        const formData = new URLSearchParams();
        formData.append("order_id", order_id);
        formData.append("order_status", 2);

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
        console.log("update-order-status RESPONSE:", response.data);
        Alert.alert("Success", "Order status has been changed.");
        navigation.replace("UpdateOrder", {
          order_id,
          curr_order_status: ORDER_STATUS_PICKED,
        });
      } else {
        Alert.alert("Failed", "QR didn't match.");
        navigation.replace("UpdateOrder", { order_id, curr_order_status });
      }
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <View style={styles.container}>
      <CameraView
        enableTorch={enableTorch}
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleScannedBarcode}
      >
        <CurvedRectangle />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  camera: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flex: 1,
  },
  buttonContainer: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
