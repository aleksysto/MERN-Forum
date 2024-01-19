import { AppState, Payload } from "../../../interfaces/AdminReducerTypes";
import { AggregateCommentObject } from "../../../interfaces/PostComments";

export function sortedComments(
  state: AppState,
  payload: Payload
): AggregateCommentObject[] | string {
  const { orderBy, order } = payload;
  if (order && orderBy) {
    const sorted: AggregateCommentObject[] = sortComments(
      state.displayComments,
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
function sortComments(
  comments: AggregateCommentObject[],
  order: "asc" | "desc",
  orderBy: string
): AggregateCommentObject[] {
  if (orderBy === "author") {
    const sortedComments: AggregateCommentObject[] = comments.sort(
      (a: AggregateCommentObject, b: AggregateCommentObject): number => {
        if (order === "asc") {
          return a[orderBy].localeCompare(b[orderBy]);
        } else {
          return b[orderBy].localeCompare(a[orderBy]);
        }
      }
    );
    return sortedComments;
  } else if (orderBy === "date") {
    const sortedComments: AggregateCommentObject[] = comments.sort(
      (a: AggregateCommentObject, b: AggregateCommentObject): number => {
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
    return sortedComments;
  } else {
    return comments;
  }
}

export function filterCommentsContent(
  state: AppState,
  payload: Payload
): AggregateCommentObject[] {
  const filter: undefined | string = payload.filter;
  if (filter) {
    const filtered: AggregateCommentObject[] = state.comments.filter(
      (comment: AggregateCommentObject): boolean =>
        comment.content.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered;
  }
  return state.comments;
}

export function removeComment(state: AppState, payload: Payload) {
  const id: undefined | string = payload.id;
  if (id) {
    const removed: AggregateCommentObject[] = state.comments.filter(
      (comment: AggregateCommentObject): boolean => comment._id !== id
    );
    return removed;
  }
  return "Error";
}
