import FirebaseManager from "../../../lib/firebase";
import commonFilter from "../../../lib/filter";

export default async function storeFcmToken(req, resp) {
  await commonFilter(req, resp);

  const userID = req.body.userID;
  const token = req.body.token;
  const deviceType = req.body.deviceType;
  if (userID == undefined) {
    resp.json({ ret: -1, message: "User id invalid!" });
  } else if (token == undefined) {
    resp.json({ ret: -2, message: "Token invalid!" });
  }
  FirebaseManager.getInstance().storeFcmToken(userID, token, deviceType);
  resp.json({ ret: 0, message: "Succeed" });
}

