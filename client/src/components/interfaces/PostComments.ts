export interface Comment {
  _id: string;
  postId: string;
  content: string;
  author: string;
  date: Date;
}
export interface AggregateCommentObject extends Comment {
  userId: string;
  userProfilePicture: string;
}

export interface CommentListItemProps {
  comment: AggregateCommentObject;
  index: number;
}
