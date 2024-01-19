import axios, { AxiosError, AxiosResponse } from "axios";
import React, { Dispatch, useReducer } from "react";
import { UserObject } from "../interfaces/UserObjectContext";
import {
  AppAction,
  AppState,
  Data,
  ErrorMessage,
  Payload,
  PostData,
  PostsResponse,
  UserData,
  UsersResponse,
} from "../interfaces/AdminReducerTypes";
import { AggregatePostObject } from "../interfaces/ForumPosts";
import { AggregateCommentObject } from "../interfaces/PostComments";
import {
  filterCommentsContent,
  removeComment,
  sortedComments,
} from "./actions/AdminActions/Comment";
import {
  filterPostsTitle,
  removePost,
  sortedPosts,
} from "./actions/AdminActions/Post";
import {
  filterUsersLogin,
  removeUser,
  sortedUsers,
} from "./actions/AdminActions/User";

export const initialState: AppState = {
  users: [],
  comments: [],
  posts: [],
  displayUsers: [],
  displayComments: [],
  displayPosts: [],
  message: "",
};

function adminReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "setUsers":
      if (action.payload.users && action.payload.message) {
        return {
          ...state,
          users: action.payload.users,
          displayUsers: action.payload.users,
          message: action.payload.message,
        };
      } else {
        return {
          ...state,
          message: "error",
        };
      }
    case "setComments":
      if (action.payload.comments && action.payload.message) {
        return {
          ...state,
          comments: action.payload.comments,
          displayComments: action.payload.comments,
          message: action.payload.message,
        };
      } else {
        return {
          ...state,
          message: "error",
        };
      }
    case "setPosts":
      if (action.payload.posts && action.payload.message) {
        return {
          ...state,
          posts: action.payload.posts,
          displayPosts: action.payload.posts,
          message: action.payload.message,
        };
      } else {
        return {
          ...state,
          message: "error",
        };
      }
    case "sortUsers":
      const users: string | UserObject[] = sortedUsers(state, action.payload);
      return typeof users === "string"
        ? { ...state, message: users }
        : {
            ...state,
            users: users,
            message: `${users.length} users`,
          };
    case "sortComments":
      const comments: string | AggregateCommentObject[] = sortedComments(
        state,
        action.payload
      );
      return typeof comments === "string"
        ? { ...state, message: comments }
        : {
            ...state,
            displayComments: comments,
            message: `${comments.length} users`,
          };
    case "sortPosts":
      const posts: string | AggregatePostObject[] = sortedPosts(
        state,
        action.payload
      );
      return typeof posts === "string"
        ? { ...state, message: posts }
        : {
            ...state,
            displayPosts: posts,
            message: `${posts.length} users`,
          };
    case "filterPostsTitle":
      const filteredPosts: AggregatePostObject[] = filterPostsTitle(
        state,
        action.payload
      );
      return {
        ...state,
        displayPosts: filteredPosts,
        message: `${filteredPosts.length} posts`,
      };
    case "filterUsersLogin":
      const filteredUsers: UserObject[] = filterUsersLogin(
        state,
        action.payload
      );
      return {
        ...state,
        displayUsers: filteredUsers,
        message: `${filteredUsers.length} users`,
      };
    case "filterCommentsContent":
      const filteredComments: AggregateCommentObject[] = filterCommentsContent(
        state,
        action.payload
      );
      return {
        ...state,
        displayComments: filteredComments,
        message: `${filteredComments.length} comments`,
      };
    case "removeUser":
      const newUsers: string | UserObject[] = removeUser(state, action.payload);
      return typeof newUsers === "string"
        ? { ...state, message: newUsers }
        : { ...state, users: newUsers };
    case "removePost":
      const newPosts: string | AggregatePostObject[] = removePost(
        state,
        action.payload
      );
      return typeof newPosts === "string"
        ? { ...state, message: newPosts }
        : { ...state, posts: newPosts };
    case "removeComment":
      const newComments: string | AggregateCommentObject[] = removeComment(
        state,
        action.payload
      );
      return typeof newComments === "string"
        ? { ...state, message: newComments }
        : { ...state, comments: newComments };
    case "setMessage":
      return action.payload.message
        ? {
            ...state,
            message: action.payload.message,
          }
        : {
            ...state,
            message: "Error",
          };
    default:
      return state;
  }
}

export default function useAdminReducer(): [AppState, Dispatch<AppAction>] {
  return useReducer(adminReducer, initialState);
}
