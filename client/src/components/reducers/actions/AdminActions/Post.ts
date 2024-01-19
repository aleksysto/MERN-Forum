import { AppState, Payload } from "../../../interfaces/AdminReducerTypes";
import { AggregatePostObject } from "../../../interfaces/ForumPosts";

export function sortedPosts(
  state: AppState,
  payload: Payload
): AggregatePostObject[] | string {
  const { orderBy, order } = payload;
  if (order && orderBy) {
    const sorted: AggregatePostObject[] = sortPosts(
      state.displayPosts,
      order,
      orderBy
    );
    if (sorted.length > 0) {
      return sorted;
    } else {
      return "Error";
    }
  }
  return "Error";
}
function sortPosts(
  posts: AggregatePostObject[],
  order: "asc" | "desc",
  orderBy: string
): AggregatePostObject[] {
  if (orderBy === "author") {
    const sortedPosts = posts.sort(
      (a: AggregatePostObject, b: AggregatePostObject): number => {
        if (order === "asc") {
          return a[orderBy].localeCompare(b[orderBy]);
        } else {
          return b[orderBy].localeCompare(a[orderBy]);
        }
      }
    );
    return sortedPosts;
  } else if (orderBy === "date") {
    const sortedPosts = posts.sort(
      (a: AggregatePostObject, b: AggregatePostObject): number => {
        if (order === "asc") {
          return (
            new Date(a[orderBy]).getTime() - new Date(b[orderBy]).getTime()
          );
        } else {
          return (
            new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime()
          );
        }
      }
    );
    return sortedPosts;
  } else {
    return posts;
  }
}

export function filterPostsTitle(
  state: AppState,
  payload: Payload
): AggregatePostObject[] {
  const filter: undefined | string = payload.filter;
  if (filter) {
    const filtered: AggregatePostObject[] = state.posts.filter(
      (post: AggregatePostObject): boolean =>
        post.title.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered;
  }
  return state.posts;
}

export function removePost(state: AppState, payload: Payload) {
  const id: undefined | string = payload.id;
  if (id) {
    const removed: AggregatePostObject[] = state.posts.filter(
      (post: AggregatePostObject): boolean => post._id !== id
    );
    return removed;
  }
  return "Error";
}
