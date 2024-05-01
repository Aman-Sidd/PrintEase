import myApi from "../myApi";

export const updatePaymentId = async ({ orderid, paymentid }) => {
  try {
    const formData = new URLSearchParams();
    formData.append("orderid", orderid);
    formData.append("paymentid", paymentid);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const response = await myApi.post(
      "/user/update-order-payment-id",
      formData,
      config
    );
    console.log("response updatePaymentId:", response.data);
    return response.data;
  } catch (err) {
    console.log("error from updatePaymentId:", err.response.data);
    throw err;
  }
};
