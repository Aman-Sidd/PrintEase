export const checkForSamePushToken = (pushToken, arr) => {
  const tokens = arr?.filter((data) => data === pushToken) || [];
  if (tokens.length == 0) {
    return false;
  }
  return true;
};
