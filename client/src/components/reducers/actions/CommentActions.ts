import {
  ActionCreatorWithPayload,
  Dispatch,
  PayloadAction,
  ThunkAction,
  createAction,
} from "@reduxjs/toolkit";
import { Comment } from "../../interfaces/PostComments";
import axios, { AxiosError, AxiosResponse } from "axios";
import { GetCommentsPayload, StateObject } from "../../interfaces/ReducerTypes";

export const setComments: ActionCreatorWithPayload<GetCommentsPayload, string> =
  createAction<GetCommentsPayload>("setComments");

export const commentsSetPage: ActionCreatorWithPayload<number, string> =
  createAction<number>("commentsSetPage");

export function getCommentsAction(
  comments: Comment[],
  message: string
): PayloadAction<GetCommentsPayload> {
  return {
    type: "setCommentsSuccess",
    payload: { comments, message },
  };
}
export function getComments(
  url: string
): ThunkAction<void, StateObject, unknown, PayloadAction<GetCommentsPayload>> {
  return async (
    dispatch: Dispatch<PayloadAction<GetCommentsPayload>>
  ): Promise<void> => {
    axios
      .get(url)
      .then((res: AxiosResponse<GetCommentsPayload>): void => {
        const { comments, message }: GetCommentsPayload = res.data;
        dispatch(getCommentsAction(comments, message));
      })
      .catch((error: AxiosError): void => {
        console.log(error.message);
      });
  };
}
