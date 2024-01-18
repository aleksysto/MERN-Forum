export interface UserObject {
  _id: string;
  login: string;
  email: string;
  posts: number;
  comments: number;
  type: "user" | "moderator" | "admin";
  lastActive: Date;
  entryDate: Date;
  profilePicture: "";
}
export interface UserContextType {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserObject;
  setUserInfo: React.Dispatch<React.SetStateAction<UserObject>>;
}
