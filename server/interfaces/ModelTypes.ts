import mongoose from "mongoose";

export interface UserObject {
  login: string;
  email: string;
  password: string;
  posts: number;
  comments: number;
  type: "user" | "moderator" | "admin";
  lastActive: Date;
  entryDate: Date;
  profilePicture: string;
}

export type CommentObject = {
  postId: string;
  content: string;
  author: string;
  date: Date;
};
export interface PostObject {
  category: string;
  title: string;
  content: string;
  author: string;
  date: Date;
}
