import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import myApi from "../api/myApi";
import { add_user } from "../redux/UserSlice";
import PageSizeDropdown from "../components/PageSizeDropdown";
import ColorDropdown from "../components/ColorDropdown";
import PrintTypeDropdown from "../components/PrintTypeDropdown";
import GradientText from "../components/GradientText";

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  console.log("USER:", user);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <GradientText
        style={{ alignSelf: "center", fontSize: 40, marginTop: 20 }}
        text="PrintEase"
      />
      <View>
        <PageSizeDropdown />
        <ColorDropdown />
        <PrintTypeDropdown />
      </View>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 20 }}>
          Select Your Document
        </Text>
        <View
          style={{
            width: "85%",
            height: 220,
            marginTop: 30,
            // backgroundColor: "red",
            borderRadius: 9,
            borderStyle: "dashed",
            borderWidth: 1.5,
            borderColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ color: "#156CF7", marginRight: 5, fontSize: 15 }}>
              Choose
            </Text>
            <Text style={{ color: "white", fontSize: 15 }}>file to upload</Text>
          </View>
          <Text style={{ color: "white", fontSize: 11 }}>
            (Only PDF format is allowed)
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            gap: 20,
            flexDirection: "row",
            marginTop: 50,
          }}
        >
          <Pressable
            style={{
              width: 143,
              borderWidth: 1,
              borderColor: "white",
              borderRadius: 8,
              height: 44,
              justifyContent: "center",
              backgroundColor: "black",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 15,
                alignSelf: "center",
              }}
            >
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Checkout")}
            style={{
              width: 143,
              borderRadius: 8,
              height: 44,
              backgroundColor: "#B0B5C9",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 15,
                alignSelf: "center",
              }}
            >
              Next
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#080A0C",
  },
});
