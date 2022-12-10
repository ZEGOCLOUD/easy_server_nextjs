import { storeFcmToken } from "../../lib/fireBase";
import commonFilter from "../../lib/filter";

export default async function storeFcmToken(req, resp) {
  await commonFilter(req, resp);

  const userID = req.body.userID;
  const token = req.body.token;
  const deviceType = req.body.deviceType;
  if (userID == undefined) {
    res.json({ ret: -1, message: "User id invalid!" });
  } else if (token == undefined) {
    res.json({ ret: -2, message: "Token invalid!" });
  }
  storeFcmToken(userID, token, deviceType);
  resp.json({ ret: 0, message: "Succeed" });
}
