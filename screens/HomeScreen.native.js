import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { getUserDetailsById } from "../api/methods/getUserDetails";
import { checkForSamePushToken } from "../components/utils/checkForSamePushToken";
import { updateUserDetails } from "../api/methods/updateUserDetails";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { addExpoPushToken } from "../redux/UtilSlice";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    console.log("project-id", projectId);

    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { pdfName, pdfUri, noOfPages, pageSize, color, printType } =
    useSelector((state) => state.order);

  const user = useSelector((state) => state.user);

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
  const updatePushToken = async (token) => {
    try {
      const response = (await getUserDetailsById(user.data.user_id)).data;
      const userDetails = response.data;
      console.log("UserDetails:", userDetails);
      console.log("expoPushToken:", token);
      let existingPushTokens = JSON.parse(userDetails.push_token);
      console.log("typeof:", typeof existingPushTokens);
      if (!existingPushTokens) existingPushTokens = [];
      if (!checkForSamePushToken(token, existingPushTokens)) {
        if (token !== null && token !== "") existingPushTokens.push(token);
        await updateUserDetails({
          userDetails,
          pushTokens: existingPushTokens,
        });
      } else console.log("Same push token already exists.");
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token ?? "");
          updatePushToken(token);
          dispatch(addExpoPushToken(token));
        }
      })
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
    width: wp("82%"),
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
