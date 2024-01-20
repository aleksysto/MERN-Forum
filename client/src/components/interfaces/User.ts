export interface UserActivityObject {
  _id: string;
  login: string;
  posts: number;
  comments: number;
  combinedActivity: number;
  profilePicture: string;
  entryDate: Date;
}

export interface TopUserListItemProps {
  user: UserActivityObject;
  index: number;
}
