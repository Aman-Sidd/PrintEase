import axios from "axios";
import { getUserDetailsById } from "./getUserDetails";

export const sendPushNotification = async ({ user_id, message }) => {
  try {
    console.log("Entered");
    const userDetailsResp = (await getUserDetailsById(user_id)).data;

    let pushTokens = [];
    if (userDetailsResp.success) {
      console.log("userDetails:", userDetailsResp.data);
      pushTokens = JSON.parse(userDetailsResp.data.push_token);
      console.log("pushTokens:", pushTokens);
      const reqObjForPushToken = pushTokens.map((pushToken) => ({
        to: pushToken,
        sound: "default",
        title: "Order Update",
        body: message,
      }));
      console.log("reqObjforPushToken:", reqObjForPushToken);

      const responseForPushToken = await axios.post(
        "https://push-notification-gamma.vercel.app/api/push-notification",
        { requestObject: reqObjForPushToken }
      );

      console.log(responseForPushToken.data.data.data);
    }
  } catch (err) {
    console.log(
      "Error occurred while sending push notification",
      err.response.data
    );
    throw err;
  }
};
