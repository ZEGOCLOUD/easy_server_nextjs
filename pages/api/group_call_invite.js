import { sendGroupCallInvitationFCM } from "../../lib/fireBase";

export default async function sendGroupCallInvitation(req, resp) {
  await commonFilter(req, resp);
  const userIDList = req.body.targetUserIDList;
  if (userIDList.length == 0) {
    resp.json({
      ret: -1,
      message: "No user id in the list for sending group call invitation.",
    });
    console.log("No user id in the list for sending group call invitation.");
  } else {
    const result = await sendGroupCallInvitationFCM(body);
    resp.json(result);
  }
}
