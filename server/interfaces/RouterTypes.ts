import { Request, Response } from "express";
import { Send } from "express-serve-static-core";
import { CommentObject, PostObject, UserObject } from "./ModelTypes";
import { InferSchemaType } from "mongoose";
const schemas = require("../models/schemas");
export interface DbUserObject extends UserObject {
  _id: string;
}

export interface GenerateTokenPayload {
  id: string;
  login: string;
  email: string;
  posts: number;
  comments: number;
  type: "user" | "moderator" | "admin";
  lastActive: Date;
  entryDate: Date;
  profilePicture: string;
}

export interface RegisterUserObject {
  login: string;
  email: string;
  password: string;
  profilePicture: string;
}

export interface CreatePostObject {
  category?: string;
  title: string;
  content: string;
  author: string;
}
export interface CreateCommentObject {
  postId: string;
  content: string;
  author: string;
}
export interface RegisterUserRequest extends Request {
  body: RegisterUserObject;
}
export interface ImageRequest extends Request {
  body: {
    image: string;
  };
}
export interface CheckAvailabilityRequest extends Request {
  query: {
    type: "email" | "login";
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
export interface CreatePostRequest extends Request {
  body: {
    title: string;
    content: string;
    author: string;
  };
  params: {
    category: string;
  };
}
export interface CreateCommentRequest extends Request {
  body: {
    content: string;
    author: string;
  };
  params: {
    postId: string;
  };
}

export interface OrderByRequest extends Request {
  query: {
    orderBy: string;
    order: string;
  };
}

export interface DeleteRequest extends Request {
  params: {
    id: string;
  };
}
export interface EditCommentRequest extends Request {
  params: {
    id: string;
  };
  body: {
    content: string;
  };
}
export interface EditPostRequest extends Request {
  params: {
    id: string;
  };
  body: {
    title?: string;
    content?: string;
    category?: string;
  };
}
export interface EditUserRequest extends Request {
  params: {
    id: string;
  };
  body: {
    login?: string;
    password?: string;
    email?: string;
    type?: string;
  };
}
export interface SearchRequest extends Request {
  query: {
    field: string;
    q: string;
    category?: string;
    keywords?: string;
  };
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

export type LoginResBody =
  | {
      message: string;
      user: UserObject;
      token: string;
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

export type SinglePostResBody =
  | { message: string; post: PostObject }
  | { message: string };

export type CommentsResBody =
  | { message: string; comments: Array<CommentObject> }
  | { message: string };

export type CountResBody = { count: number } | { message: string };

export type PostCommentResBody =
  | { message: string; comment: CommentObject }
  | { message: string };
export type ActiveUsersResBody =
  | {
      message: string;
      users: Array<DbUserObject>;
    }
  | { message: string };
export type PatchResBody = {
  message: string;
};
