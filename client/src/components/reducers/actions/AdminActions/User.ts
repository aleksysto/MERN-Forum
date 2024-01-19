import { AppState, Payload } from "../../../interfaces/AdminReducerTypes";
import { UserObject } from "../../../interfaces/UserObjectContext";

export function sortedUsers(
  state: AppState,
  payload: Payload
): UserObject[] | string {
  const { orderBy, order } = payload;
  if (order && orderBy) {
    const sorted: UserObject[] = sortUsers(state.displayUsers, order, orderBy);
    if (sorted.length > 0) {
      return sorted;
    } else {
      return "Error";
    }
  }
  return "Error";
}
function sortUsers(
  users: UserObject[],
  order: "asc" | "desc",
  orderBy: string
): UserObject[] {
  if (orderBy === "login") {
    const sortedData = users.sort((a: UserObject, b: UserObject): number => {
      if (order === "asc") {
        return a[orderBy].localeCompare(b[orderBy]);
      } else {
        return b[orderBy].localeCompare(a[orderBy]);
      }
    });
    return sortedData;
  } else if (orderBy === "lastActive") {
    const sortedData = users.sort((a: UserObject, b: UserObject): number => {
      if (order === "asc") {
        return new Date(a[orderBy]).getTime() - new Date(b[orderBy]).getTime();
      } else {
        return new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime();
      }
    });
    return sortedData;
  } else {
    return [];
  }
}

export function filterUsersLogin(
  state: AppState,
  payload: Payload
): UserObject[] {
  const filter: undefined | string = payload.filter;
  if (filter) {
    const filtered: UserObject[] = state.users.filter(
      (user: UserObject): boolean =>
        user.login.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered;
  }
  return state.users;
}

export function removeUser(state: AppState, payload: Payload) {
  const id: undefined | string = payload.id;
  if (id) {
    const removed: UserObject[] = state.users.filter(
      (user: UserObject): boolean => user._id !== id
    );
    console.log(state.users);
    console.log(removed.length, removed);
    return removed;
  }
  return "Error";
}
