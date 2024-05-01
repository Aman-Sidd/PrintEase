import myApi from "../myApi";

export const getPickedOrders = async ({ limit = 10, offset = 0 }) => {
  try {
    const formData = new URLSearchParams();
    formData.append("limit", limit);
    formData.append("offset", offset);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await myApi.post(
      "/common/get-picked-orders",
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
