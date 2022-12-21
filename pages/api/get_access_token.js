import commonFilter from "../../lib/filter";
const { generateToken04 } = require("../../lib/zegocloud_server_token_sdk");
if (!(process.env.ZEGOCLOUD_APP_ID && process.env.ZEGOCLOUD_SERVER_SECRET)) {
  throw new Error("You must define an APP_ID and SERVER_SECRET");
}
const APP_ID = process.env.ZEGOCLOUD_APP_ID;
const SERVER_SECRET = process.env.ZEGOCLOUD_SERVER_SECRET;

export default async function generateAccessToken(req, resp) {
  await commonFilter(req, resp);
  let expiredTs = req.query.expired_ts;
  if (!expiredTs) {
    expiredTs = 3600;
  }

  const userID = req.query.userID;
  if (!userID) {
    return resp.status(500).json({ error: "userID is required" });
  }

  let userName = req.query.userName;
  if (!userName) {
    userName = userID;
  }

  const token = generateToken04(
    parseInt(APP_ID),
    userID,
    SERVER_SECRET,
    parseInt(expiredTs),
    ""
  );

  return resp.json({
    token,
  });
}
