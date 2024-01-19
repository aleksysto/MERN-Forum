import { AggregateCommentObject } from "./PostComments";

export interface GetCommentsPayload extends SetMessagePayload {
  comments: AggregateCommentObject[];
}

export interface SetMessagePayload {
  message: string;
}

export interface StateObject {
  message: string;
  comments: AggregateCommentObject[];
  printedComments: AggregateCommentObject[];
}
