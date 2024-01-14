import { Comment } from "./PostComments";

export interface GetCommentsPayload extends SetMessagePayload {
  comments: Comment[];
}

export interface SetMessagePayload {
  message: string;
}

export interface StateObject {
  message: string;
  comments: Comment[];
  printedComments: Comment[];
}
