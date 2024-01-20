import { AppAction, AppState } from "./AdminReducerTypes";

export interface PostObject {
  _id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  date: Date;
}
export interface AggregatePostObject extends PostObject {
  userId: string;
  userProfilePicture: string;
}

export interface PostItemProps {
  post: AggregatePostObject;
  index: number;
}

export interface AdminPostItemProps extends PostItemProps {
  dispatch: React.Dispatch<AppAction>;
}
