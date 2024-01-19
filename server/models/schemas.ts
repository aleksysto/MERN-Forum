const mongoose = require("mongoose");
import { Schema, InferSchemaType } from "mongoose";
import {
  CommentObject,
  PostObject,
  ReportObject,
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
const reportSchema = new Schema<ReportObject>({
  type: {
    type: String,
    required: true,
  },
  reportedId: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: String,
    required: true,
  },
  reportedOn: {
    type: Date,
    default: Date.now(),
  },
  reportedObject: {
    type: Schema.Types.Mixed,
  },
});
const Reports: InferSchemaType<typeof reportSchema> = mongoose.model(
  "Reports",
  reportSchema,
  "reports"
);

interface schemasObject {
  Users: InferSchemaType<typeof userSchema>;
  Posts: InferSchemaType<typeof postSchema>;
  Comments: InferSchemaType<typeof commentSchema>;
  Reports: InferSchemaType<typeof reportSchema>;
}

const mySchemas: schemasObject = {
  Users: Users,
  Posts: Posts,
  Comments: Comments,
  Reports: Reports,
};
module.exports = mySchemas;
