import { Comment } from "./PostComments";

export interface GetCommentsPayload {
  comments: Comment[];
  message: string;
}

export interface StateObject {
  message: string;
  comments: Comment[];
  printedComments: Comment[];
}
