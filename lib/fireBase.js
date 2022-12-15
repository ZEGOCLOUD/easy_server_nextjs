const admin = require("firebase-admin");
const tokenMap = {};
const deviceTypeMap = {}; // Android not support sending notification and data at the same time.

const FA_PROJECT_ID = process.env.FA_PROJECT_ID;
const FA_PRIVATE_KEY_ID = process.env.FA_PRIVATE_KEY_ID;
const FA_PRIVATE_KEY = process.env.FA_PRIVATE_KEY
  ? process.env.FA_PRIVATE_KEY.replace(/\\n/gm, "\n")
  : undefined;
const FA_CLIENT_EMAIL = process.env.FA_CLIENT_EMAIL;
const FA_CLIENT_ID = process.env.FA_CLIENT_ID;
const FA_CLIENT_X509_CERT_URL = process.env.FA_CLIENT_X509_CERT_URL;

// var serviceAccount = require("firebase_admin.json");
const serviceAccount = {
  type: "service_account",
  project_id: FA_PROJECT_ID,
  private_key_id: FA_PRIVATE_KEY_ID,
  private_key: FA_PRIVATE_KEY,
  client_email: FA_CLIENT_EMAIL,
  client_id: FA_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: FA_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export function storeFcmTokenFCM(userID, token, deviceType) {
  tokenMap[userID] = token;
  if (!!deviceType) {
    deviceTypeMap[userID] = deviceType;
  }
  console.log(
    "Update token finished, current count: ",
    Object.keys(tokenMap).length
  );
}

export function sendCallInvitationFCM(body) {
  const userID = body.targetUserID;
  const messaging = admin.messaging();
  const payload = {
    token: tokenMap[userID],
    data: body,
  };

  if (deviceTypeMap[userID] && deviceTypeMap[userID] != "android") {
    payload["notification"] = {
      title: "You have a new call!",
      body: `${body.callerUserName} is calling you.`,
    };
  }

  if (!tokenMap[userID]) {
    throw new Error("No fcm token");
  } else {
    return messaging.send(payload);
  }
}

export function declineCallInvitationFCM(body) {
  const userID = body.callerUserID;
  const messaging = admin.messaging();

  const payload = {
    token: tokenMap[userID],
    data: body,
  };

  return messaging.send(payload);
}

export function sendGroupCallInvitationFCM(body) {
  const userIDList = body.targetUserIDList;

  const tokens = [];
  const invalidTokens = [];
  for (let i = 0; i < userIDList.length; i++) {
    const userID = userIDList[i];
    if (tokenMap[userID]) {
      tokens.push(tokenMap[userID]);
    } else {
      invalidTokens.push(tokenMap[userID]);
    }
  }
  if (tokens.length == 0) {
    return {
      ret: -2,
      message: "All of the user has no FCM token register",
    };
  }
  const messaging = admin.messaging();
  const inviteData = body;
  inviteData.targetUserIDList = inviteData.targetUserIDList.join(",");
  const payload = {
    tokens: tokens,
    notification: {
      title: "You have a new call!",
      body: `${inviteData.callerUserName} is calling you.`,
    },
    data: inviteData,
  };

  return new Promise((res, rej) => {
    messaging
      .sendMulticast(payload)
      .then((result) => {
        console.log(">>>>>>>>", result);
        if (result.failureCount > 0) {
          const failedTokens = [];
          result.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(tokens[idx]);
              invalidTokens.push(tokens[idx]);
              console.log(resp.error);
            }
          });
          console.log("List of tokens that caused failures: " + failedTokens);
        }

        if (invalidTokens.length == 0) {
          res({ ret: 0, message: "Succeed" });
        } else if (invalidTokens.length < userIDList.length) {
          res({
            ret: 0,
            message:
              "Some of user has no FCM token register: " +
              invalidTokens.join(","),
          });
        } else {
          res({
            ret: -2,
            message: "All of the user has no FCM token register or send failed",
          });
        }
      })
      .catch((error) => {
        res({ ret: -1, message: error });
        console.log("Error on sending invitation: ", error);
      });
  });
}
