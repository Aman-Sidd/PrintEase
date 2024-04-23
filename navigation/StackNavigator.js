import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import PdfViewScreen from "../screens/PdfViewScreen";
import OwnerOrdersScreen from "../screens/Owner/OwnerOrdersScreen";
import OwnerOrderDetailScreen from "../screens/Owner/OwnerOrderDetailScreen";

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Print"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PdfView"
        component={PdfViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: "Checkout",
          headerStyle: {
            backgroundColor: "#080A0C",
          },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};

const OrderNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderList"
        component={OrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PdfView"
        component={PdfViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: "Order Details",
          headerStyle: {
            backgroundColor: "#080A0C",
          },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};

export const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "black" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="list-ul" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black", // Background color of the header
          },
          headerTintColor: "white", // Text color of the header
          headerTitleAlign: "center", // Alignment of the header title
        }}
      />
    </Tab.Navigator>
  );
};

export const OwnerOrderStackNavigator = () => {
  const OwnerStack = createNativeStackNavigator();
  return (
    <OwnerStack.Navigator>
      <OwnerStack.Screen
        name="OwnerOrder"
        component={OwnerOrdersScreen}
        options={{ headerShown: false }}
      />
      <OwnerStack.Screen
        name="OwnerOrderDetail"
        component={OwnerOrderDetailScreen}
        options={{
          title: "Order Details",
          headerStyle: {
            backgroundColor: "#080A0C",
          },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
    </OwnerStack.Navigator>
  );
};

export const OwnerTabNavigator = () => {
  const OwnerTab = createBottomTabNavigator();
  return (
    <OwnerTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "black" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <OwnerTab.Screen
        name="Orders"
        component={OwnerOrderStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="list-ul" size={size} color={color} />
          ),
        }}
      />
      <OwnerTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black", // Background color of the header
          },
          headerTintColor: "white", // Text color of the header
          headerTitleAlign: "center", // Alignment of the header title
        }}
      />
    </OwnerTab.Navigator>
  );
};

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Login",
            headerStyle: {
              backgroundColor: "#080A0C",
            },
            headerTintColor: "white",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OwnerTab"
          component={OwnerTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: "Register",
            headerStyle: {
              backgroundColor: "#080A0C",
            },
            headerTintColor: "white",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
