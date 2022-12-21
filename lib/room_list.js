const crypto = require("crypto");
const request = require("request");

const ZEGO_APP_ID = process.env.ZEGOCLOUD_APP_ID;
const ZEGO_SERVER_SECRET = process.env.ZEGOCLOUD_SERVER_SECRET;

if (!(ZEGO_APP_ID && ZEGO_SERVER_SECRET)) {
  throw new Error("You must set your ZEGOCLOUD_APP_ID and ZEGOCLOUD_SERVER_SECRET");
}

const cache = new Map();
const cacheExpireMS = 500;
function makeCacheKey(index, size) {
  return `${index},${size}`;
}

//Signature=md5(AppId + SignatureNonce + ServerSecret + Timestamp)
function GenerateUASignature(appId, signatureNonce, serverSecret, timestamp) {
  const hash = crypto.createHash("md5"); //Specifies the use of the MD5 algorithm in the hash algorithm
  const str = appId + signatureNonce + serverSecret + timestamp;
  hash.update(str);
  //hash.digest('hex') Indicates that the format of the output is hexadecimal
  return hash.digest("hex");
}

export async function describeRoomList(PageIndex, PageSize) {
  // query cache first
  const cacheKey = makeCacheKey(PageIndex, PageSize);
  const timestamp_ms = Date.now();
  if (
    cache[cacheKey] &&
    timestamp_ms - cache[cacheKey].timestamp_ms < cacheExpireMS
  ) {
    return cache[cacheKey].body;
  }

  const timestamp = Math.round(timestamp_ms / 1000);
  const signatureNonce = crypto.randomBytes(8).toString("hex");
  const sig = GenerateUASignature(
    ZEGO_APP_ID,
    signatureNonce,
    ZEGO_SERVER_SECRET,
    timestamp
  );
  const roomID = encodeURIComponent("room1");
  const url = `https://rtc-api.zego.im/?Action=DescribeRoomList&RoomId[]=${roomID}&AppId=${ZEGO_APP_ID}&SignatureNonce=${signatureNonce}&Timestamp=${timestamp}&Signature=${sig}&SignatureVersion=2.0&IsTest=false&PageIndex=${req.query.PageIndex}&PageSize=${req.query.PageSize}`;
  return new Promise((res, rej) => {
    request(
      {
        uri: url,
        method: "GET",
        json: true,
      },
      function (_err, _res, _resBody) {
        // console.log('Url: ', url)
        // console.log('StatusCode: ', _res.statusCode)
        // console.log('Error: ', _err)
        if (!_err && _res.statusCode) {
          // console.log(_resBody)
          cache[cacheKey] = {
            body: _resBody,
            timestamp_ms: timestamp_ms,
          };
          res(_resBody);
        } else {
          cache.delete[cacheKey];
          rej(_err);
        }
      }
    );
  });
}
