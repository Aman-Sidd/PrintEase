import { PAGE_LIMIT } from "../../constants/PAGE_LIMIT";
import myApi from "../myApi";

export const getPendingOrders = async ({ limit = 10, offset = 0 }) => {
  try {
    const formData = new URLSearchParams();
    formData.append("limit", limit);
    formData.append("offset", offset);
    console.log("LIMIT:", limit);
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await myApi.post(
      "/owner/get-pending-orders",
      formData,
      config
    );
    console.log("response:", response.data);
    return response.data;
  } catch (err) {
    console.log("error:", err.response.data);
    return null;
  }
};
