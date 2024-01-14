import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "../CommentReducer";
import { useDispatch } from "react-redux";

const commentsStore = configureStore({
  reducer: commentsReducer,
});
export default commentsStore;

export type CommentsDispatch = typeof commentsStore.dispatch;
export const useCommentsDispatch: () => CommentsDispatch = useDispatch;
