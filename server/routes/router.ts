import { Router, Request, Response } from "express";
import { Schema, InferSchemaType } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;
import * as types from "../interfaces/RouterTypes";
import { PostObject, UserObject } from "../interfaces/ModelTypes";

const express = require("express");
const schemas = require("../models/schemas");
const router: Router = express.Router();

// HTTP POST for registering users
router.post(
  "/api/register",
  async (
    req: types.RegisterUserRequest,
    res: types.TypedResponse<types.RegisterResBody>
  ): Promise<void> => {
    const { login, email, password }: types.RegisterUserObject = req.body;
    const userData: types.RegisterUserObject = {
      login: login,
      email: email,
      password: password,
    };

    const newUser: InferSchemaType<typeof schemas.Users> = new schemas.Users(
      userData
    );

    const saveUser: InferSchemaType<typeof schemas.Users> =
      await newUser.save();
    if (saveUser) {
      res.json({ message: "User registered successfully", user: saveUser });
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
  }
);

// HTTP GET to check for available username/email
router.get(
  "/api/register/checkAvailability",
  async (
    req: types.CheckAvailabilityRequest,
    res: types.TypedResponse<types.AvailableResBody>
  ): Promise<void> => {
    const { type, value }: { type: string; value: string } = req.query;
    const foundData: InferSchemaType<typeof schemas.Users> =
      await schemas.Users.findOne({ [type]: value }, "login email");
    if (foundData) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
    console.log(foundData);
  }
);

// HTTP POST for logging in
router.post(
  "/api/login",
  async (
    req: types.LoginRequest,
    res: types.TypedResponse<types.LoginResBody>
  ): Promise<void> => {
    const { login, password }: { login: string; password: string } = req.body;
    const foundUser: InferSchemaType<typeof schemas.Users> =
      await schemas.Users.findOne(
        { login: login, password: password },
        { _id: 0, password: 0, __v: 0 }
      );
    if (foundUser) {
      res.json({ message: "User logged in successfully", user: foundUser });
    } else {
      res.status(400).json({ message: "Failed to login user" });
    }
  }
);

// HTTP GET for getting all posts
router.get(
  "/api/posts",
  async (req: Request, res: types.TypedResponse<types.PostsResBody>): Promise<void> => {
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.find({});
    if (posts) {
      res.json({ message: `${posts.length} found`, posts: posts });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);

// HTTP GET for specific post category
router.get(
  "/api/posts/category/:category",
  async (
    req: types.CategoryPostsRequest,
    res: types.TypedResponse<types.PostsResBody>
  ): Promise<void> => {
    const category: string = req.params.category;
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.find({ category: category });
    if (posts) {
      res.json({ message: `${posts.length} found`, posts: posts });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);

// HTTP GET for specific post by id
router.get(
  "/api/posts/id/:id",
  async (
    req: types.IdPostsRequest,
    res: types.TypedResponse<types.PostsResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    if (!checkIfCorrectId(id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const post: InferSchemaType<typeof schemas.Posts> =
        await schemas.Posts.findById(id);
      if (post) {
        res.json({ message: "Post found", posts: [post] });
      } else {
        res.status(404).json({ message: "No posts found" });
      }
    }
  }
);

// HTTP GET posts by author
router.get(
  "/api/posts/author/:author",
  async (
    req: types.AuthorPostsRequest,
    res: types.TypedResponse<types.PostsResBody>
  ): Promise<void> => {
    const author: string = req.params.author;
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.find({ author: author });
    if (posts) {
      res.json({ message: `${posts.length} found`, posts: posts });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);

// HTTP GET for 5 newest posts
router.get(
  "/api/posts/newest",
  async (req: Request, res: types.TypedResponse<types.PostsResBody>): Promise<void> => {
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.find({}).sort({ date: -1 }).limit(5);
    if (posts) {
      res.json({ message: `Our newest posts`, posts: posts });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);

// HTTP GET for users latest post
router.get(
  "/api/posts/:username/latest",
  async (req: types.UsersLatestRequest, res: types.TypedResponse<types.PostsResBody>): Promise<void> => {
    const username: string = req.params.username;
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.findOne({author: username}).sort({ date: -1 });
    if (posts) {
      res.json({ message: `The latest post`, posts: [posts] });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);
// HTTP GET for users latest comment
router.get(
  "/api/comments/:username/latest",
  async (req: types.UsersLatestRequest, res: types.TypedResponse<types.CommentsResBody>): Promise<void> => {
    const username: string = req.params.username;
    const comments: InferSchemaType<typeof schemas.Comments> =
      await schemas.Comments.findOne({author: username}).sort({ date: -1 });
    if (comments) {
      res.json({ message: `The latest comment`, comments: [comments] });
    } else {
      res.status(404).json({ message: "No comments found" });
    }
  }
);

// HTTP GET for all posts comments
router.get(
  "/api/posts/:id/comments",
  async (req: types.IdPostsRequest, res: types.TypedResponse<types.CommentsResBody>): Promise<void> => {
    const id: string = req.params.id;
    if (!checkIfCorrectId(id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const comments: InferSchemaType<typeof schemas.Comments> =
        await schemas.Comments.find({ postId: id });
      if (comments) {
        res.json({ message: `${comments.length} found`, comments: comments });
      } else {
        res.status(404).json({ message: "No comments found" });
      }
    }
  }
);
// HTTP GET for posts comment page
router.get(
  "/api/posts/:id/comments/:page",
  async (req: types.CommentsPageRequest, res: types.TypedResponse<types.CommentsResBody>): Promise<void> => {
    const id: string = req.params.id;
    if (!checkIfCorrectId(id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const page: number = parseInt(req.params.page);
      const skipValue: number = (page-1)*10
      const comments: InferSchemaType<typeof schemas.Comments> =
        await schemas.Comments.find({ postId: id }).skip(skipValue).limit(10);
      if (comments) {
        res.json({ message: `${comments.length} found`, comments: comments });
      } else {
        res.status(404).json({ message: "No comments found" });
      }
    }
  }
);

// HTTP GET for users comments
router.get(
  "/api/comments/:username",
  async (req: types.UsersLatestRequest, res: types.TypedResponse<types.CommentsResBody>): Promise<void> => {
    const username: string = req.params.username;
    const comments: InferSchemaType<typeof schemas.Comments> =
      await schemas.Comments.find({author: username});
    if (comments) {
      res.json({ message: `${comments.length} found`, comments: comments });
    } else {
      res.status(404).json({ message: "No comments found" });
    }
  }
);

function checkIfCorrectId(id: string): boolean {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
module.exports = router;
