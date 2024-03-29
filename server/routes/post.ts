import { InferSchemaType } from "mongoose";
import { Router, Request, Response } from "express";
import * as types from "../interfaces/RouterTypes";
const schemas = require("../models/schemas");
const ObjectId = require("mongoose").Types.ObjectId;
const express = require("express");
import {
  secretKey,
  checkIfCorrectId,
  checkIfUserIsAuthorOrAdmin,
  checkTokenValidity,
  checkContent,
  checkCategory,
  checkTitle,
} from "./utils/ValidityCheck";
import jwt, { JwtPayload } from "jsonwebtoken";
import getCategoryPosts from "./utils/GetCategoryPosts";

const router: Router = express.Router();
// HTTP POST for creating new posts
router.post(
  "/api/posts/:category",
  async (
    req: types.CreatePostRequest,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { title, content, author }: types.CreatePostObject = req.body;
      const token: string | undefined = req.headers.authorization;
      const category: string = req.params.category;
      const postData: types.CreatePostObject = {
        category: category,
        title: title,
        content: content,
        author: author,
      };
      const newPost: InferSchemaType<typeof schemas.Posts> = new schemas.Posts(
        postData
      );

      if (
        !title ||
        !content ||
        !author ||
        !category ||
        title.length < 10 ||
        !checkContent(content) ||
        !checkCategory(category)
      ) {
        return res.status(400).json({ message: "Bad request" });
      }
      if (!token || !checkTokenValidity(token)) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const postingUser: types.DbUserObject = await schemas.Users.findOne({
        _id: decodedToken._id,
      });

      if (!postingUser || postingUser.login !== author) {
        return res.status(401).json({ message: "Bad request" });
      }

      const savedPost: InferSchemaType<typeof schemas.Posts> =
        await new schemas.Posts(newPost).save();
      const updateUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOneAndUpdate(
          { _id: postingUser._id },
          { posts: postingUser.posts + 1, lastActive: Date.now() }
        );

      if (savedPost && updateUser) {
        return res.json({ message: "Post created" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// HTTP GET for getting all posts
router.get(
  "/api/posts",
  async (
    req: Request,
    res: types.TypedResponse<types.AggregatePostsResBody>
  ): Promise<void> => {
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "login",
            as: "user",
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $project: {
            _id: 1,
            category: 1,
            title: 1,
            content: 1,
            author: 1,
            date: 1,
            userId: { $arrayElemAt: ["$user._id", 0] },
            userProfilePicture: { $arrayElemAt: ["$user.profilePicture", 0] },
          },
        },
      ]);
    if (posts.length > 0) {
      res.json({ message: `${posts.length} found`, posts: posts });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);

// HTTP GET for number of posts in category
router.get(
  "/api/posts/category/:category/count",
  async (
    req: types.CategoryPostsRequest,
    res: types.TypedResponse<types.CountResBody>
  ): Promise<void> => {
    const category: string = req.params.category;
    const count: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.countDocuments({ category: category });
    if (count) {
      res.json({ count: count });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

// HTTP GET for specific post category
router.get("/api/posts/category/:category", getCategoryPosts);

// HTTP GET for specific post by id
router.get(
  "/api/posts/id/:id",
  async (
    req: types.IdPostsRequest,
    res: types.TypedResponse<types.AggregateSinglePostResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    if (!checkIfCorrectId(id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const post: InferSchemaType<typeof schemas.Posts> =
        await schemas.Posts.aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "login",
              as: "user",
            },
          },
          {
            $project: {
              _id: 1,
              category: 1,
              title: 1,
              content: 1,
              author: 1,
              date: 1,
              userId: { $arrayElemAt: ["$user._id", 0] },
              userProfilePicture: { $arrayElemAt: ["$user.profilePicture", 0] },
            },
          },
        ]);
      if (post.length > 0) {
        res.json({ message: "Post found", post: post });
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
    if (posts && posts.length > 0) {
      res.json({ message: `${posts.length} found`, posts: posts });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);

// HTTP GET posts sorted by date/user (asc/desc)
router.get(
  "/api/posts/sort/",
  async (req: types.OrderByRequest, res: Response) => {
    const { orderBy, order }: { orderBy: string; order: string } = req.query;
    if (
      (orderBy === "date" || orderBy === "author") &&
      (order === "asc" || order === "desc")
    ) {
      const posts: InferSchemaType<typeof schemas.Posts> =
        await schemas.Posts.find({}).sort({ [orderBy]: order });
      if (posts) {
        res.json({ message: `${posts.length} found`, posts: posts });
      } else {
        res.status(404).json({ message: "No posts found" });
      }
    } else {
      res.status(400).json({ message: "Invalid request" });
    }
  }
);

// HTTP GET for 5 newest posts
router.get(
  "/api/posts/newest",
  async (
    req: Request,
    res: types.TypedResponse<types.PostsResBody>
  ): Promise<void> => {
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
  async (
    req: types.UsersLatestRequest,
    res: types.TypedResponse<types.PostsResBody>
  ): Promise<void> => {
    const username: string = req.params.username;
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.findOne({ author: username }).sort({ date: -1 });
    if (posts) {
      res.json({ message: `The latest post`, posts: [posts] });
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  }
);

// HTTP DELETE for deleting posts
router.delete(
  "/api/posts/id/:id",
  async (
    req: types.DeleteRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void | types.TypedResponse<types.PatchResBody>> => {
    try {
      const id: string = req.params.id;
      const token: string | undefined = req.headers.authorization;
      if (!token || !checkIfCorrectId(id) || !checkTokenValidity(token)) {
        return res.status(400).json({ message: "Invalid token or ID" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const userId: string = decodedToken._id;

      const post: InferSchemaType<typeof schemas.Posts> =
        await schemas.Posts.findOne({ _id: id });

      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });

      if (!post || !user) {
        return res.status(500).json({ message: "User or Post not found" });
      }
      if (!checkIfUserIsAuthorOrAdmin(user, post)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updateUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOneAndUpdate(
          { _id: user._id },
          { posts: user.posts - 1 }
        );
      await schemas.Posts.findOneAndDelete({ _id: id });
      res.json({ message: `Post ${id} deleted` });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// HTTP PATCH for editing post
router.patch(
  "/api/posts/id/:id",
  async (
    req: types.EditPostRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void | types.TypedResponse<types.PatchResBody>> => {
    try {
      const id: string = req.params.id;
      const {
        title,
        content,
        category,
      }: { title?: string; content?: string; category?: string } = req.body;
      const token: string | undefined = req.headers.authorization;

      if (!token || !checkIfCorrectId(id) || !checkTokenValidity(token)) {
        return res.status(400).json({ message: "Invalid token or ID" });
      }
      if (!title && !content && !category) {
        return res.status(400).json({ message: "No fields to update" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const userId: string = decodedToken._id;
      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });
      const post: InferSchemaType<typeof schemas.Posts> =
        await schemas.Posts.findOne({ _id: id });

      if (!user || !post) {
        return res.status(404).json({ message: "User or Post not found" });
      }

      if (!checkIfUserIsAuthorOrAdmin(user, post)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (title && checkTitle(title)) {
        await schemas.Posts.findOneAndUpdate({ _id: id }, { title: title });
      }

      if (content && checkContent(content)) {
        await schemas.Posts.findOneAndUpdate({ _id: id }, { content: content });
      }

      if (category && checkCategory(category)) {
        await schemas.Posts.findOneAndUpdate(
          { _id: id },
          { category: category }
        );
      }

      res.json({ message: `Post ${id} updated` });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
