import { UserObject } from "../interfaces/UserObjectContext";

export function checkAuthor(userInfo: UserObject, postAuthor: string): boolean {
  return userInfo.login === postAuthor ? true : false;
}

export function checkAdmin(userInfo: UserObject): boolean {
  return userInfo.type === "admin" || userInfo.type === "moderator"
    ? true
    : false;
}
