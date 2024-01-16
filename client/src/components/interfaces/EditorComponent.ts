import { AggregatePostObject } from "./ForumPosts";
import { AggregateComment } from "./PostComments";

export interface UploadPost {
  title: string;
  author: string;
  content: string;
}
export interface EditedPost {
  title: string;
  content: string;
  category?: string;
}
export interface EditedComment {
  content: string;
}
export interface UploadComment {
  postId: string;
  content: string;
  author: string;
}

export interface CommentEditorProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}
export interface EditCommentProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  comment: AggregateComment;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface EditPostProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  post: AggregatePostObject;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface EditorComponentProps extends CommentEditorProps {
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
}
