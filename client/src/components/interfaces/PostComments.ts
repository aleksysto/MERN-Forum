import { AppAction } from "./AdminReducerTypes";

export interface CommentObject {
  _id: string;
  postId: string;
  content: string;
  author: string;
  date: Date;
}
export interface AggregateCommentObject extends CommentObject {
  userId: string;
  userProfilePicture: string;
}

export interface CommentListItemProps {
  comment: AggregateCommentObject;
  index: number;
}

export interface AdminCommentListItemProps extends CommentListItemProps {
  dispatch: React.Dispatch<AppAction>;
}
