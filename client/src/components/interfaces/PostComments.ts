export interface Comment {
  _id: string;
  content: string;
  author: string;
  date: Date;
}

export interface CommentListItemProps {
  comment: Comment;
  index: number;
}
