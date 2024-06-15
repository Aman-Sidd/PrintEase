import { checkForSamePushToken } from "../../components/utils/checkForSamePushToken";
import { getUserDetailsById } from "./getUserDetails";
import { updateUserDetails } from "./updateUserDetails";

export const updatePushToken = async ({ token, user }) => {
  try {
    console.log("USER from updatePushToken", user);
    const response = (await getUserDetailsById(user.user_id)).data;
    const userDetails = response.data;
    console.log("UserDetails:", userDetails);
    console.log("expoPushToken:", token);
    let existingPushTokens = [];
    if (
      userDetails.push_token !== "undefined" &&
      userDetails.push_token !== null
    )
      existingPushTokens = JSON.parse(userDetails.push_token);
    console.log("typeof:", typeof existingPushTokens);
    if (!checkForSamePushToken(token, existingPushTokens)) {
      if (token !== null && token !== "") existingPushTokens.push(token);
      await updateUserDetails({
        userDetails,
        pushTokens: existingPushTokens,
      });
    } else console.log("Same push token already exists.");
  } catch (err) {
    console.log("Error:", err);
  }
};
