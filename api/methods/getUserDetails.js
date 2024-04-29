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
    const result = {
      success: false,
      ...response.data,
    };
    return result;
  }
};
