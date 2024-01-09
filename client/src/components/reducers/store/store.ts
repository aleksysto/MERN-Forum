import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "../CommentReducer";

const commentsStore = configureStore({
  reducer: {
    comments: commentsReducer,
  },
});
