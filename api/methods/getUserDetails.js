import myApi from "../myApi";

export const getUserDetails = async () => {
  try {
    const response = await myApi.get("/common/get-user-details");
    const result = {
      success: true,
      ...response.data,
    };
    return result;
  } catch (err) {
    console.log("error:", err.response.data);
    throw err;
  }
};

export const getUserDetailsById = async (userid) => {
  try {
    const response = await myApi.get(
      `/admin/get-user-details?userid=${userid}`
    );
    return response;
  } catch (err) {
    console.log("error in getUserDetailsById", err);
    throw err;
  }
};
