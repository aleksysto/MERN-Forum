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
import { Comment } from "../interfaces/PostComments";
import {
  GetCommentsPayload,
  SetMessagePayload,
  StateObject,
} from "../interfaces/ReducerTypes";

const initialState: StateObject = {
  message: "",
  comments: [] as Comment[],
  printedComments: [] as Comment[],
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
        const comments: Comment[] = action.payload.comments;
        console.log("in reducer", message, comments);
        return {
          ...state,
          comments: comments,
          message: message,
          printedComments: comments,
        };
      }
    );
    builder.addCase(
      commentsSetPage,
      (state: StateObject, action: PayloadAction<number>): StateObject => {
        const skipValue: number = action.payload * 10;
        const newComments: Array<Comment> = state.comments.slice(
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
        console.log("in reducer", message);
        return {
          ...state,
          message: message,
        };
      }
    );
  }
);

export default commentsReducer;
