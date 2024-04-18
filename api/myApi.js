import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

const myApi = axios.create({
  baseURL: "https://printease-backend.vercel.app/",
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
