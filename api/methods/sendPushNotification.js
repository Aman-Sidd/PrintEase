import axios from "axios";
import { getUserDetailsById } from "./getUserDetails";

export const sendPushNotification = async ({ user_id, message }) => {
  try {
    console.log("Entered");
    const userDetailsResp = await getUserDetailsById(user_id);
    let pushTokens = [];
    if (userDetailsResp.success) {
      console.log("userDetails:", userDetailsResp.data);
      pushTokens = JSON.parse(userDetailsResp.data.push_token);
      console.log("pushTokens:", pushTokens);
      const reqObjForPushToken = pushTokens.map((pushToken) => ({
        to: pushToken,
        sound: "default",
        body: message,
      }));
      console.log("reqObjforPushToken:", reqObjForPushToken);
      const pushTokenConfig = {
        headers: {
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      };

      const responseForPushToken = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        JSON.stringify(reqObjForPushToken),
        pushTokenConfig
      );

      console.log(responseForPushToken.data);
    }
  } catch (err) {
    console.log("Error occurred while sending push notification");
    throw err;
  }
};
