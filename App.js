import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigation/StackNavigator";
import { Provider } from "react-redux";
import MyStore from "./redux/MyStore";
// import messaging from "@react-native-firebase/messaging";
// import { useEffect } from "react";

export default function App() {
  // useEffect(() => {
  //   const requestUserPermission = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);
  //     }
  //   };

  //   if (requestUserPermission()) {
  //     messaging()
  //       .getToken()
  //       .then((token) => {
  //         console.log(token);
  //       });
  //   } else {
  //     console.log("Failed token status!", authStatus);
  //   }

  //   // Check whether an initial notification is available

  //   messaging()
  //     .getInitialNotification()
  //     .then(async(remoteMessage) => {
  //       if (remoteMessage) {
  //         console.log(
  //           "Notification caused app to open from quit state",
  //           remoteMessage.notification
  //         );
  //       }
  //     });

  //   messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //     console.log(
  //       "Notification caused app to open from background state:",
  //       remoteMessage.notification
  //     );
  //   });

  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     console.log("Message handled in the background!", remoteMessage);
  //   });

  //   const unsubscribe = messaging().onMessage(async remoteMessage=>{
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   })

  //   return unsubscribe;
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={MyStore}>
        <StackNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
