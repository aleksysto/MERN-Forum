const ObjectId = require("mongoose").Types.ObjectId;
import * as types from "../../interfaces/RouterTypes";
import {
  CommentObject,
  PostObject,
  UserObject,
} from "../../interfaces/ModelTypes";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

export const secretKey = "kluczpodwannom";
export function checkIfCorrectId(id: string): boolean {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function checkIfUserIsAuthorOrAdmin(
  user: types.DbUserObject,
  object: PostObject | CommentObject
): boolean {
  if (checkIfAdmin(user)) {
    return true;
  } else if (user.login === object.author) {
    return true;
  } else {
    return false;
  }
}
export function checkIfUserIsAccOwnerOrAdmin(
  userId: string,
  editingUser: types.DbUserObject
): boolean {
  if (userId === String(new ObjectId(editingUser._id))) {
    return true;
  } else if (checkIfAdmin(editingUser)) {
    return true;
  } else {
    return false;
  }
}

export function checkTokenValidity(token: string): boolean {
  try {
    jwt.verify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

export function checkIfAdmin(user: types.DbUserObject): boolean {
  if (user.type === "admin" || user.type === "moderator") {
    return true;
  } else {
    return false;
  }
}
