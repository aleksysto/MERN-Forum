import jwt, { JwtPayload } from "jsonwebtoken";
import * as types from "../../interfaces/RouterTypes";
import { secretKey } from "./ValidityCheck";
export default function generateToken(user: types.DbUserObject) {
  const payload: types.GenerateTokenPayload = {
    id: user._id,
    login: user.login,
    email: user.email,
    posts: user.posts,
    comments: user.comments,
    type: user.type,
    lastActive: user.lastActive,
    entryDate: user.entryDate,
  };
  // 7 days -> 7days*24h*60min*60sec
  const expiresIn: number = 7 * 24 * 60 * 60;
  const token: string = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}
