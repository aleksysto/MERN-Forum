import { PostObject } from "./ForumPosts";
import { CommentObject } from "./PostComments";
import { UserObject } from "./UserObjectContext";

export interface ReportObjectUser {
  _id: string;
  type: "user";
  reportedId: string;
  reportedBy: string;
  reportedOn: Date;
  reportedObject: UserObject;
}

export interface ReportObjectPost {
  _id: string;
  type: "post";
  reportedId: string;
  reportedBy: string;
  reportedOn: Date;
  reportedObject: PostObject;
}

export interface ReportObjectComment {
  _id: string;
  type: "comment";
  reportedId: string;
  reportedBy: string;
  reportedOn: Date;
  reportedObject: CommentObject;
}

export type ReportObject =
  | ReportObjectUser
  | ReportObjectPost
  | ReportObjectComment;
