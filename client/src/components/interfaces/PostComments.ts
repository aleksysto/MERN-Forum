export interface Comment {
  _id: string;
  postId: string;
  content: string;
  author: string;
  date: Date;
}
export interface AggregateComment extends Comment {
  userId: string;
  userProfilePicture: string;
}

export interface CommentListItemProps {
  comment: AggregateComment;
  index: number;
}
