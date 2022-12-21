import commonFilter from "../../lib/filter";
import { describeRoomList } from "../../lib/room_list";
if (!(process.env.APP_ID && process.env.SERVER_SECRET)) {
  throw new Error("You must define an APP_ID and SERVER_SECRET");
}
const APP_ID = process.env.APP_ID;
const SERVER_SECRET = process.env.SERVER_SECRET;

export default async function generateAccessToken(req, resp) {
  await commonFilter(req, resp);
  // set default query params
  const PageIndex = req.query.PageIndex || 1;
  const PageSize = req.query.PageSize || 200;
  const body = await describeRoomList(PageIndex, PageSize);
  return resp.json(body);
}
