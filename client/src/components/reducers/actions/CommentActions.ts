import {
  ActionCreatorWithPayload,
  Dispatch,
  PayloadAction,
  ThunkAction,
  createAction,
} from "@reduxjs/toolkit";
import { AggregateComment } from "../../interfaces/PostComments";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  GetCommentsPayload,
  SetMessagePayload,
  StateObject,
} from "../../interfaces/ReducerTypes";

export const setComments: ActionCreatorWithPayload<GetCommentsPayload, string> =
  createAction<GetCommentsPayload>("setComments");

export const commentsSetPage: ActionCreatorWithPayload<number, string> =
  createAction<number>("commentsSetPage");

export const setMessage: ActionCreatorWithPayload<SetMessagePayload, string> =
  createAction<SetMessagePayload>("setMessage");

export function setMessageAction(
  message: string
): PayloadAction<SetMessagePayload> {
  return setMessage({ message });
}

export function getCommentsAction(
  comments: AggregateComment[],
  message: string
): PayloadAction<GetCommentsPayload> {
  return setComments({ comments, message });
}

export function setPageAction(page: number): PayloadAction<number> {
  return commentsSetPage(page);
}

export function getComments(
  url: string
): ThunkAction<void, StateObject, unknown, PayloadAction<GetCommentsPayload>> {
  return async (
    dispatch: Dispatch<PayloadAction<GetCommentsPayload | SetMessagePayload>>
  ): Promise<void> => {
    dispatch(setMessageAction("Loading..."));
    axios
      .get(url)
      .then((res: AxiosResponse<GetCommentsPayload>): void => {
        const { comments, message }: GetCommentsPayload = res.data;
        dispatch(getCommentsAction(comments, message));
      })
      .catch((error: AxiosError<{ message: string }>): void => {
        error.response
          ? dispatch(setMessageAction(error.response.data.message))
          : dispatch(setMessageAction("Server error"));
      });
  };
}
