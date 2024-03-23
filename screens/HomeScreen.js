import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import myApi from "../api/myApi";
import { add_user } from "../redux/UserSlice";
import PageSizeDropdown from "../components/PageSizeDropdown";
import ColorDropdown from "../components/ColorDropdown";
import PrintTypeDropdown from "../components/PrintTypeDropdown";
import GradientText from "../components/GradientText";
import * as DocumentPicker from "expo-document-picker";
import Pdf from "react-native-pdf";

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const [selectedPDF, setSelectedPDF] = useState(null);
  console.log("USER:", user);
  const pickDocument = async () => {
    console.log("clicked");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Filter only PDF files
      });
      console.log(result);
      if (!result.canceled) {
        console.log("Document picked:", result.assets[0]);
        setSelectedPDF({
          name: result.assets[0].name,
          uri: result.assets[0].uri,
        });
        // Handle the picked document URI, you may want to save it or upload it
      } else {
        console.log("Document picking canceled");
      }
    } catch (err) {
      console.log("Error picking document:", err);
    }
  };
  const openPDF = () => {
    if (selectedPDF) {
      navigation.navigate("PdfView", { uri: selectedPDF.uri });
    }
  };
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
        <Pressable
          style={{
            width: "85%",
            height: 180,
            marginTop: 30,
            // backgroundColor: "red",
            borderRadius: 9,
            borderStyle: "dashed",
            borderWidth: 1.5,
            borderColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={pickDocument}
        >
          {!selectedPDF ? (
            <>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text
                  style={{ color: "#156CF7", marginRight: 5, fontSize: 15 }}
                >
                  Choose
                </Text>
                <Text style={{ color: "white", fontSize: 15 }}>
                  file to upload
                </Text>
              </View>
              <Text style={{ color: "white", fontSize: 11 }}>
                (Only PDF format is allowed)
              </Text>
            </>
          ) : (
            <>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text
                  style={{ color: "white", fontSize: 17, fontWeight: "500" }}
                >
                  {selectedPDF.name}
                </Text>
              </View>
              <Pressable onPress={openPDF} style={styles.button}>
                <Text style={styles.text}>Open File</Text>
              </Pressable>
            </>
          )}
        </Pressable>

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
  button: {
    marginTop: 8,
    backgroundColor: "#3498db", // Blue background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF", // White text
    fontWeight: "bold",
    textAlign: "center",
  },
});
