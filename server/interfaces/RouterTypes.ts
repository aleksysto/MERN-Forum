import { Request, Response } from "express";
import { Send } from "express-serve-static-core";
import { CommentObject, PostObject, UserObject } from "./ModelTypes";
import { InferSchemaType } from "mongoose";
const schemas = require("../models/schemas");
export interface RegisterUserObject {
  login: string;
  email: string;
  password: string;
}
export interface RegisterUserRequest extends Request {
  body: RegisterUserObject;
}
export interface CheckAvailabilityRequest extends Request {
  query: {
    type: string;
    value: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    login: string;
    password: string;
  };
}

export interface CategoryPostsRequest extends Request {
  params: {
    category: string;
  };
}
export interface IdPostsRequest extends Request {
  params: {
    id: string;
  };
}
export interface CommentsPageRequest extends Request {
  params: {
    id: string;
    page: string;
  };
}
export interface AuthorPostsRequest extends Request {
  params: {
    author: string;
  };
}
export interface UsersLatestRequest extends Request {
  params: {
    username: string;
  };
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

export type LoginResBody =
  | {
      message: string;
      user: UserObject;
    }
  | { message: string };

export type AvailableResBody = {
  available: boolean;
};

export type RegisterResBody =
  | { message: string; user: InferSchemaType<typeof schemas.Users> }
  | { message: string };

export type PostsResBody =
  | { message: string; posts: Array<PostObject> }
  | { message: string };

  export type CommentsResBody = {message: string, comments: Array<CommentObject>} | {message: string}