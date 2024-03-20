import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

const myApi = axios.create({
  baseURL:
    "https://ef9d-2409-40d1-1015-3d85-b919-a3cd-528a-8fe6.ngrok-free.app",
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
