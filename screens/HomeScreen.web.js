import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-community/async-storage";
import { setPdfName, setPdfUri } from "../redux/OrderSlice";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import GradientText from "../components/formUtils/GradientText";
import PageSizeDropdown from "../components/dropdown/PageSizeDropdown";
import ColorDropdown from "../components/dropdown/ColorDropdown";
import PrintTypeDropdown from "../components/dropdown/PrintTypeDropdown";
import UnderlinedText from "../components/formUtils/UnderlinedText";
import { useMediaQuery } from "react-responsive";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { pdfName, pdfUri, noOfPages, pageSize, color, printType } =
    useSelector((state) => state.order);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  console.log("isDesktop:", isDesktopOrLaptop);
  console.log("isMobile", isMobile);
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
      alert(
        "Incomplete Selections! Please make sure to select all the dropdown selections."
      );
    } else if (!pdfName || !pdfUri) {
      alert("File Not Selected! Please select a file to proceed.");
    } else navigation.navigate("Checkout");
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <View style={{ alignSelf: "center" }}>
          <GradientText style={styles.gradientText} text="PrintEase" />
        </View>
        <View
          style={{
            width: isDesktopOrLaptop ? "50%" : "80%",
            alignSelf: "center",
          }}
        >
          <PageSizeDropdown />
          <ColorDropdown />
          <PrintTypeDropdown />
        </View>

        <View style={styles.selectDocumentContainer}>
          <Text style={styles.selectDocumentText}>Select Your Document</Text>

          {!pdfUri ? (
            <Pressable
              style={{
                ...styles.documentPicker,
                alignSelf: "center",
                // width: isDesktopOrLaptop ? "48%" : "48%",
              }}
              onPress={pickDocument}
            >
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
    fontSize: hp("5%"),
  },

  selectDocumentContainer: {
    alignItems: "center",
    marginTop: hp("2%"),
  },
  selectDocumentText: {
    color: "white",
    fontSize: hp("2.5%"),
  },
  documentPicker: {
    // width: wp("70%"),
    width: "48%",
    height: hp("18%"),
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
    justifyContent: "center",
    gap: 30,
    paddingHorizontal: 20,
    marginTop: "3%",
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
