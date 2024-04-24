import { CameraView, useCameraPermissions } from "expo-camera/next";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import CurvedRectangle from "../../components/CurvedRectangle";
import myApi from "../../api/myApi";
import LoadingScreen from "../../components/LoadingScreen";
import { ORDER_STATUS_PICKED } from "../../constants/ORDER_STATUS";

const CameraComponent = ({ navigation, route }) => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  const { order_id, curr_order_status } = route.params;

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
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

        Alert.alert("Success", "Order status has been changed.");
        navigation.replace("UpdateOrder", {
          order_id,
          ORDER_STATUS_PICKED,
        });
      } else {
        Alert.alert("Failed", "QR didn't match.");
        navigation.replace("UpdateOrder", { order_id, curr_order_status });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <View style={styles.container}>
      <CameraView
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
    flex: 1,
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
