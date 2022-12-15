import { sendCallInvitationFCM } from "../../lib/fireBase";

export default async function sendCallInvitation(req, resp) {
  await commonFilter(req, resp);
  const userID = req.body.targetUserID;
  if (!userID) {
    resp.json({ ret: -1, message: "Invalid userID for send call invitation" });
    console.log("Invalid userID for send call invitation");
  } else {
    sendCallInvitationFCM(req.body)
      .then((result) => {
        console.log(result);
        resp.json({ ret: 0, message: "Succeed" });
      })
      .catch((error) => {
        if (error.message === "No fcm token") {
          resp.json({ ret: -2, message: "No fcm token for user: " + userID });
          console.log("No fcm token for user: " + userID);
        } else {
          resp.json({ ret: -1, message: error });
          console.log("Error on sending invitation: ", error);
        }
      });
  }
}
