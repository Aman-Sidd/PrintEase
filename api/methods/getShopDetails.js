import myApi from "../myApi";

export const getShopDetails = async ({ shop_id }) => {
  try {
    const response = await myApi.get(
      `/admin/get-shop-details?shopid=${shop_id}`
    );
    return response.data;
  } catch (err) {
    console.log("Error in getShopDetails:", err.response.data);
    throw err;
  }
};
