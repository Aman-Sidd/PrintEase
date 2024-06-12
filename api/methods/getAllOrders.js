import myApi from "../myApi";

export const getAllOrders = async ({ limit = 10, offset = 0 }) => {
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
      "/common/get-all-orders?shop_id=1",
      formData,
      config
    );
    return response.data;
  } catch (err) {
    console.log("error:", err.response.data);
    return null;
  }
};
