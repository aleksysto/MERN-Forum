import {
  ActionReducerMapBuilder,
  PayloadAction,
  Reducer,
  createReducer,
} from "@reduxjs/toolkit";
import { commentsSetPage, setComments } from "./actions/CommentActions";
import { Comment } from "../interfaces/PostComments";
import { GetCommentsPayload, StateObject } from "../interfaces/ReducerTypes";

const initialState: StateObject = {
  message: "",
  comments: [],
  printedComments: [],
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
        return { ...state, comments: comments, message: message };
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
  }
);

export default commentsReducer;
