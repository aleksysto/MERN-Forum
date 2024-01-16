const mongoose = require("mongoose");
import { Schema, InferSchemaType } from "mongoose";
import {
  CommentObject,
  PostObject,
  UserObject,
} from "../interfaces/ModelTypes";
import { CommonConnectionOptions } from "tls";

const userSchema = new Schema<UserObject>({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  posts: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "user",
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
});
const Users: InferSchemaType<typeof userSchema> = mongoose.model(
  "Users",
  userSchema,
  "users"
);

const postSchema = new Schema<PostObject>({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index({ title: "text", content: "text", author: "text" });

const Posts: InferSchemaType<typeof postSchema> = mongoose.model(
  "Posts",
  postSchema,
  "posts"
);

const commentSchema = new Schema<CommentObject>({
  postId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Comments: InferSchemaType<typeof commentSchema> = mongoose.model(
  "Comments",
  commentSchema,
  "comments"
);
interface schemasObject {
  Users: InferSchemaType<typeof userSchema>;
  Posts: InferSchemaType<typeof postSchema>;
  Comments: InferSchemaType<typeof commentSchema>;
}

const mySchemas: schemasObject = {
  Users: Users,
  Posts: Posts,
  Comments: Comments,
};
module.exports = mySchemas;
