export interface PostObject {
  _id: string;
  title: string;
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
