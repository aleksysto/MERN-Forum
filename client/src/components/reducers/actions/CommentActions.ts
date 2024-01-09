import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";

export const setComments: ActionCreatorWithPayload<
  Array<string>,
  string
> = createAction<Array<string>>("setComments");

export const commentsNextPage: ActionCreatorWithPayload<number, string> =
  createAction<number>("commentsNextPage");

export const commentsPreviousPage: ActionCreatorWithPayload<number, string> =
  createAction<number>("commentsNextPage");
