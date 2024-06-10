import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigator from "./navigation/StackNavigator";
import MyStore from "./redux/MyStore";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={MyStore}>
        <StackNavigator />
        <StatusBar style="light" backgroundColor="#080A0C" />
      </Provider>
    </GestureHandlerRootView>
  );
}
