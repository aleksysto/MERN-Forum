import { AggregateComment } from "./PostComments";

export interface GetCommentsPayload extends SetMessagePayload {
  comments: AggregateComment[];
}

export interface SetMessagePayload {
  message: string;
}

export interface StateObject {
  message: string;
  comments: AggregateComment[];
  printedComments: AggregateComment[];
}
