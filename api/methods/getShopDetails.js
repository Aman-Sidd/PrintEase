import myApi from "../myApi";

export const getShopDetails = async ({ shop_id }) => {
  try {
    console.log("entered in getSHopDetails");
    const response = await myApi.get(
      `/admin/get-shop-details?shopid=${shop_id}`
    );
    console.log("RESPONSE FROM GETSHOPDETAILS:", response.data);
    return response.data;
  } catch (err) {
    console.log("Error in getShopDetails:", err.response.data);
    throw err;
  }
};
