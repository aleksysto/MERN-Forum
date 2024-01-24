import axios, { AxiosError, AxiosResponse } from "axios";
import {
  CommentData,
  CommentsResponse,
  ErrorMessage,
  PostData,
  PostsResponse,
  ReportData,
  ReportsResponse,
  UserData,
  UsersResponse,
} from "../../../interfaces/AdminReducerTypes";

export async function loadUsers(): Promise<UserData> {
  return new Promise<UserData>((resolve, reject) => {
    axios
      .get("http://localhost:4000/api/users")
      .then((res: AxiosResponse<UsersResponse>) => {
        resolve({ data: res.data.users, message: res.data.message });
      })
      .catch((err: AxiosError<ErrorMessage>) => {
        reject(err.response?.data.message);
      });
  });
}

export async function loadPosts(): Promise<PostData> {
  return new Promise<PostData>((resolve, reject) => {
    axios
      .get("http://localhost:4000/api/posts")
      .then((res: AxiosResponse<PostsResponse>) => {
        resolve({ data: res.data.posts, message: res.data.message });
      })
      .catch((err: AxiosError<ErrorMessage>) => {
        reject(err.response?.data.message);
      });
  });
}

export async function loadComments(): Promise<CommentData> {
  return new Promise<CommentData>((resolve, reject) => {
    axios
      .get("http://localhost:4000/api/comments")
      .then((res: AxiosResponse<CommentsResponse>) => {
        resolve({ data: res.data.comments, message: res.data.message });
      })
      .catch((err: AxiosError<ErrorMessage>) => {
        reject(err.response?.data.message);
      });
  });
}

export async function loadReports(): Promise<ReportData> {
  return new Promise<ReportData>((resolve, reject) => {
    axios
      .get("http://localhost:4000/api/reports", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res: AxiosResponse<ReportsResponse>) => {
        resolve({ data: res.data.reports, message: res.data.message });
      })
      .catch((err: AxiosError<ErrorMessage>) => {
        reject(err.response?.data.message);
      });
  });
}
