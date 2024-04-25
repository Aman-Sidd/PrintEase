import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
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
import { AntDesign } from "@expo/vector-icons";
import ColorDropdown from "../components/ColorDropdown";
import PrintTypeDropdown from "../components/PrintTypeDropdown";
import GradientText from "../components/GradientText";
import * as DocumentPicker from "expo-document-picker";
import Pdf from "react-native-pdf";
import AsyncStorage from "@react-native-community/async-storage";
import UnderlinedText from "../components/UnderlinedText";
import { setPdfName, setPdfUri } from "../redux/OrderSlice";

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { pdfName, pdfUri, noOfPages, pageSize, color, printType } =
    useSelector((state) => state.order);

  console.log("USER:", user);
  const pickDocument = async () => {
    console.log("clicked");
    if (pdfUri) {
      navigation.navigate("PdfView", { uri: pdfUri, showButtons: true });
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Filter only PDF files
      });
      console.log(result);
      if (!result.canceled) {
        console.log("Document picked:", result.assets[0]);

        dispatch(setPdfName({ pdfName: result.assets[0].name }));
        dispatch(setPdfUri({ pdfUri: result.assets[0].uri }));

        // Handle the picked document URI, you may want to save it or upload it

        navigation.navigate("PdfView", {
          uri: result.assets[0].uri,
          showButtons: true,
        });
      } else {
        console.log("Document picking canceled");
      }
    } catch (err) {
      console.log("Error picking document:", err);
    }
  };
  const openPDF = () => {
    if (pdfUri) {
      navigation.navigate("PdfView", { uri: pdfUri, showButtons: true });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Login");
      }
    };
    fetchUser();
  }, []);

  const onResetFile = () => {
    dispatch(setPdfName({ pdfName: null }));
    dispatch(setPdfUri({ pdfUri: null }));
  };

  const handleNextButton = () => {
    if (!pageSize || !color || !printType) {
      Alert.alert(
        "Incomplete Selections",
        "Please make sure to select all the dropdown selections."
      );
    } else if (!pdfName || !pdfUri) {
      Alert.alert("File Not Selected", "Please select a file to proceed.");
    } else navigation.navigate("Checkout");
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <GradientText style={styles.gradientText} text="PrintEase" />
        <View>
          <PageSizeDropdown />
          <ColorDropdown />
          <PrintTypeDropdown />
        </View>

        <View style={styles.selectDocumentContainer}>
          <Text style={styles.selectDocumentText}>Select Your Document</Text>

          {!pdfUri ? (
            <Pressable style={styles.documentPicker} onPress={pickDocument}>
              <View style={styles.documentPickerContent}>
                <Text style={styles.chooseText}>Choose</Text>
                <Text style={styles.uploadText}>file to upload</Text>
              </View>
              <Text style={styles.pdfFormatText}>
                (Only PDF format is allowed)
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.documentPicker, { paddingVertical: "10%" }]}
              onPress={pickDocument}
            >
              <Pressable onPress={openPDF} style={styles.pdfPreview}>
                <AntDesign
                  name="pdffile1"
                  size={25}
                  color="white"
                  style={styles.pdfIcon}
                />
                <View style={styles.pdfInfoContainer}>
                  <UnderlinedText style={styles.pdfNameText}>
                    {pdfName}
                  </UnderlinedText>
                </View>
                <Text style={styles.pdfPagesText}>({noOfPages} Pages)</Text>
              </Pressable>
            </Pressable>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={onResetFile} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Reset File&nbsp;</Text>
          </Pressable>
          <Pressable onPress={handleNextButton} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next&nbsp;</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#080A0C",
  },
  gradientText: {
    alignSelf: "center",
    fontSize: 40,
    marginTop: 20,
  },
  selectDocumentContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  selectDocumentText: {
    color: "white",
    fontSize: 20,
  },
  documentPicker: {
    width: "85%",
    paddingVertical: "15%",
    marginTop: 30,
    borderRadius: 9,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  documentPickerContent: {
    flexDirection: "row",
  },
  chooseText: {
    color: "#156CF7",
    marginRight: 5,
    fontSize: 15,
  },
  uploadText: {
    color: "white",
    fontSize: 15,
  },
  pdfFormatText: {
    color: "white",
    fontSize: 11,
  },
  pdfPreview: {
    justifyContent: "center",
    alignItems: "center",
  },
  pdfIcon: {
    marginVertical: 10,
  },
  pdfInfoContainer: {
    flexDirection: "row",
  },
  pdfNameText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  pdfPagesText: {
    color: "#cfd0d1",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginTop: "8%",
  },
  cancelButton: {
    width: 143,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    backgroundColor: "black",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
  nextButton: {
    width: 143,
    borderRadius: 8,
    height: 44,
    backgroundColor: "#B0B5C9",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
});

export default HomeScreen;
