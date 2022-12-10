import { declineCallInvitation } from "../../lib/fireBase";

export default async function declineCallInvitation(req, resp) {
  await commonFilter(req, resp);
  const userID = req.body.targetUserID;
  const roomID = req.body.roomID;
  if (!userID) {
    resp.json({
      ret: -1,
      message: "Invalid userID for canceling call invitation",
    });
    console.log("Invalid userID for send offline invitation");
  } else if (!roomID) {
    resp.json({
      ret: -2,
      message: "Invalid roomID for canceling call invitation",
    });
    console.log("Invalid roomID for canceling call invitation");
  } else {
    declineCallInvitation(req.body)
      .then((result) => {
        console.log(result);
        resp.json({ ret: 0, message: "Succeed" });
      })
      .catch((error) => {
        resp.json({ ret: -1, message: error });
        console.log("Error on canceling call invitation: ", error);
      });
  }
}
