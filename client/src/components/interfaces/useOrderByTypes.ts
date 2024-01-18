import { AggregatePostObject } from "./ForumPosts";

export interface OrderObject {
  field: "author" | "date";
  order: "asc" | "desc";
}

export interface useOrderByHook {
  order: OrderObject;
  setOrder: (value: string) => void;
  posts: null | AggregatePostObject[];
  setPosts: (value: null | AggregatePostObject[]) => void;
}
