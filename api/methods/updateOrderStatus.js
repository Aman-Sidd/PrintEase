import myApi from "../myApi";

export const updateOrderStatus = async ({ order_id, order_status }) => {
  try {
    const formData = new URLSearchParams();
    formData.append("order_id", order_id);
    formData.append("order_status", order_status);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const response = await myApi.post(
      "/owner/update-order-status",
      formData,
      config
    );
    return response.data;
  } catch (err) {
    console.log("error occurred while updating order status");
    throw err;
  }
};
