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
    const result = {
      ...response.data,
    };
    return result;
  } catch (err) {
    const result = {
      success: false,
      ...response.data,
    };
    return result;
  }
};
