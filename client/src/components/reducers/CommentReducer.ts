import {
  ActionCreatorWithPayload,
  ActionReducerMapBuilder,
  PayloadAction,
  Reducer,
  createAction,
  createReducer,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  commentsNextPage,
  commentsPreviousPage,
  setComments,
} from "./actions/CommentActions";
type StateType = {
  comments: Array<string>;
  printedComments: Array<string>;
};

const initialState: StateType = {
  comments: [],
  printedComments: [],
};

const commentsReducer: Reducer<StateType> = createReducer<StateType>(
  initialState,
  (builder: ActionReducerMapBuilder<StateType>) => {
    builder.addCase(
      setComments,
      (state: StateType, action: PayloadAction<Array<string>>) => {
        return { ...state, comments: action.payload };
      }
    );
    builder.addCase(
      commentsNextPage,
      (state: StateType, action: PayloadAction<number>) => {
        const skipValue: number = action.payload * 10;
        const newComments: Array<string> = state.comments
          .slice(skipValue)
          .slice(-10);
        return { ...state, printedComments: newComments };
      }
    );
    builder.addCase(commentsPreviousPage, (state, action) => {
      const skipValue: number = action.payload * 10;
      const newComments: Array<string> = state.comments
        .slice(skipValue)
        .slice(-10);
      return { ...state, printedComments: newComments };
    });
  }
);

export default commentsReducer;
