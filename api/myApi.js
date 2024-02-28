import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

const myApi = axios.create({
  baseURL: "https://d442-2409-40d1-3-e882-c141-6ff6-2e5-ba80.ngrok-free.app",
});

myApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default myApi;
