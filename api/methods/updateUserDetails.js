import myApi from "../myApi";

export const updateUserDetails = async ({ userDetails, pushTokens }) => {
  try {
    const formDataForPushToken = new URLSearchParams();
    formDataForPushToken.append("userid", userDetails.user_id);
    formDataForPushToken.append("pushtokens", JSON.stringify(pushTokens));
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const responsePushTokenUpdate = await myApi.post(
      "/admin/update-user-details",
      formDataForPushToken,
      config
    );
    if (responsePushTokenUpdate.data.success)
      console.log("pushToken updated!!!");
    else if (responsePushTokenUpdate.data.error)
      console.log("some error occurred while updating push token!");
  } catch (err) {
    console.log("Error while updating user details!!!", err);
    // throw err.response.data;
  }
};
