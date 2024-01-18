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

export function checkEmail(email: string): boolean {
  const mailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (mailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
}

export function checkLogin(login: string): boolean {
  if (login.length >= 3 && login.length <= 20) {
    return true;
  } else {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const pwdRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (pwdRegex.test(password)) {
    return true;
  } else {
    return false;
  }
}

export function checkCategory(category: string): boolean {
  if (category == "category" || category == "test") {
    return true;
  } else {
    return false;
  }
}
export function checkContent(content: string): boolean {
  if (content.length > 50) {
    return true;
  } else {
    return false;
  }
}
export function checkTitle(title: string): boolean {
  if (title.length > 10) {
    return true;
  } else {
    return false;
  }
}
