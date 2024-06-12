import myApi from "../myApi";

export const getAllShops = async () => {
  try {
    const response = await myApi.get("/admin/get-all-shops");
    return response.data;
  } catch (err) {
    console.log("Error:", err.response.data);
    throw err;
  }
};
