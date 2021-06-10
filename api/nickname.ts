import axios from "axios";
import cookie from "cookie";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (request: VercelRequest, response: VercelResponse) => {
  let nickname: string;

  const savedNickname = request.cookies["nickname"];
  if (savedNickname != null && request.query.refresh == null) {
    nickname = savedNickname;
  } else {
    const nicknameRequest = await axios.get(
      "https://nickname.hwanmoo.kr/?format=json"
    );
    const newNickname = nicknameRequest["data"]["words"][0];
    const cookieHeader = cookie.serialize("nickname", newNickname, {
      sameSite: "none",
      secure: true,
    });
    response.setHeader("Set-Cookie", [cookieHeader]);
    nickname = newNickname;
  }

  try {
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
  } catch (_) {
    // Pass
  }
  response.status(200).send({ nickname: nickname });
};
