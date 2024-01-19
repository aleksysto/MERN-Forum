import {
  ActionReducerMapBuilder,
  PayloadAction,
  Reducer,
  createReducer,
} from "@reduxjs/toolkit";
import {
  commentsSetPage,
  setComments,
  setMessage,
} from "./actions/CommentActions";
import { AggregateCommentObject } from "../interfaces/PostComments";
import {
  GetCommentsPayload,
  SetMessagePayload,
  StateObject,
} from "../interfaces/ReducerTypes";

const initialState: StateObject = {
  message: "",
  comments: [] as AggregateCommentObject[],
  printedComments: [] as AggregateCommentObject[],
};

const commentsReducer: Reducer<StateObject> = createReducer<StateObject>(
  initialState,
  (builder: ActionReducerMapBuilder<StateObject>) => {
    builder.addCase(
      setComments,
      (
        state: StateObject,
        action: PayloadAction<GetCommentsPayload>
      ): StateObject => {
        const message: string = action.payload.message;
        const comments: AggregateCommentObject[] = action.payload.comments;
        return {
          ...state,
          comments: comments,
          message: message,
          printedComments: comments.slice(0, 10),
        };
      }
    );
    builder.addCase(
      commentsSetPage,
      (state: StateObject, action: PayloadAction<number>): StateObject => {
        const skipValue: number = action.payload * 10;
        const newComments: AggregateCommentObject[] = state.comments.slice(
          skipValue,
          skipValue + 10
        );
        return { ...state, printedComments: newComments };
      }
    );
    builder.addCase(
      setMessage,
      (
        state: StateObject,
        action: PayloadAction<SetMessagePayload>
      ): StateObject => {
        const message: string = action.payload.message;
        return {
          ...state,
          message: message,
        };
      }
    );
  }
);

export default commentsReducer;
