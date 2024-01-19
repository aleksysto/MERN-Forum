import { AggregatePostObject } from "./ForumPosts";
import { AggregateCommentObject } from "./PostComments";
import { UserObject } from "./UserObjectContext";

export interface UserData {
  data: UserObject[];
  message: string;
}
export interface UsersResponse {
  message: string;
  users: UserObject[];
}

export interface PostData {
  data: AggregatePostObject[];
  message: string;
}
export interface PostsResponse {
  message: string;
  posts: AggregatePostObject[];
}

export interface CommentData {
  data: AggregateCommentObject[];
  message: string;
}
export interface CommentsResponse {
  message: string;
  comments: AggregateCommentObject[];
}
export interface ErrorMessage {
  message: string;
}
export type Data =
  | UserObject[]
  | AggregatePostObject[]
  | AggregateCommentObject[];

export interface AppState {
  posts: AggregatePostObject[];
  comments: AggregateCommentObject[];
  users: UserObject[];
  displayUsers: UserObject[];
  displayComments: AggregateCommentObject[];
  displayPosts: AggregatePostObject[];
  message: string;
}

export interface Payload {
  id?: string;
  users?: UserObject[];
  posts?: AggregatePostObject[];
  comments?: AggregateCommentObject[];
  message?: string;
  filter?: string;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface AppAction {
  type: string;
  payload: Payload;
}

export interface UserPanelProps {
  user: UserObject;
  index: number;
}

export type AdminContextType = [AppState, React.Dispatch<AppAction>];
