export interface UploadPost {
  title: string;
  author: string;
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
export interface EditorComponentProps extends CommentEditorProps {
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
}
