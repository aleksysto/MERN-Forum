import { InferSchemaType } from "mongoose";
import { Router, Request, Response } from "express";
import * as types from "../interfaces/RouterTypes";
const schemas = require("../models/schemas");
const express = require("express");
import {
  secretKey,
  checkIfCorrectId,
  checkIfUserIsAuthorOrAdmin,
  checkTokenValidity,
} from "./utils/ValidityCheck";
import jwt, { JwtPayload } from "jsonwebtoken";

const router: Router = express.Router();
// HTTP POST for creating new posts
router.post(
  "/api/posts/:category",
  async (req: types.CreatePostRequest, res: Response): Promise<void> => {
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
    if (token) {
      if (checkTokenValidity(token)) {
        const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);
        if (typeof decodedToken !== "string") {
          const postingUser: types.DbUserObject = await schemas.Users.findOne({
            _id: decodedToken.id,
          });
          if (
            content &&
            author &&
            title &&
            postingUser &&
            postingUser.login === author
          ) {
            const savedPost: InferSchemaType<typeof schemas.Posts> =
              await new schemas.Posts(newPost).save();
            if (savedPost) {
              res.json({ message: "Post created", comment: savedPost });
            } else {
              res.status(500).json({ message: "Error creating comment" });
            }
          } else {
            res.status(500).json({ message: "Bad request" });
          }
        } else {
          res.status(401).json({ message: "Server error" });
        }
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
);

// HTTP GET for getting all posts
router.get(
  "/api/posts",
  async (
    req: Request,
    res: types.TypedResponse<types.PostsResBody>
  ): Promise<void> => {
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.find({});
    if (posts) {
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
    res: types.TypedResponse<types.SinglePostResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    if (!checkIfCorrectId(id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const post: InferSchemaType<typeof schemas.Posts> =
        await schemas.Posts.findById(id);
      if (post) {
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

// HTTP GET for users latest comment
router.get(
  "/api/comments/:username/latest",
  async (
    req: types.UsersLatestRequest,
    res: types.TypedResponse<types.CommentsResBody>
  ): Promise<void> => {
    const username: string = req.params.username;
    const comments: InferSchemaType<typeof schemas.Comments> =
      await schemas.Comments.findOne({ author: username }).sort({ date: -1 });
    if (comments) {
      res.json({ message: `The latest comment`, comments: [comments] });
    } else {
      res.status(404).json({ message: "No comments found" });
    }
  }
);

// HTTP DELETE for deleting posts
router.delete(
  "/api/posts/id/:id",
  async (
    req: types.DeleteRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    const token: string | undefined = req.headers.authorization;
    if (token) {
      if (checkIfCorrectId(id)) {
        if (checkTokenValidity(token)) {
          const decodedToken: string | JwtPayload = jwt.verify(
            token,
            secretKey
          );
          if (typeof decodedToken !== "string") {
            const userId: string = decodedToken.id;

            const post: InferSchemaType<typeof schemas.Posts> =
              await schemas.Posts.findOne({ _id: id });

            const user: InferSchemaType<typeof schemas.Users> =
              await schemas.Users.findOne({ _id: userId });

            if (post && user) {
              if (checkIfUserIsAuthorOrAdmin(user, post)) {
                await schemas.Posts.findOneAndDelete({ _id: id });
                res.json({ message: `Post ${id} deleted` });
              } else {
                res.status(401).json({ message: "Unauthorized" });
              }
            } else {
              res.status(500).json({ message: "User or Post not found" });
            }
          } else {
            res.status(500).json({ message: "Server error" });
          }
        } else {
          res.status(400).json({ message: "Invalid token" });
        }
      } else {
        res.status(400).json({ message: "Invalid ID" });
      }
    }
  }
);

// HTTP PATCH for editing post
router.patch(
  "/api/posts/id/:id",
  async (
    req: types.EditPostRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    const {
      title,
      content,
      category,
    }: { title?: string; content?: string; category?: string } = req.body;
    const token: string | undefined = req.headers.authorization;
    if (token) {
      if (checkIfCorrectId(id)) {
        if (checkTokenValidity(token)) {
          const decodedToken: string | JwtPayload = jwt.verify(
            token,
            secretKey
          );
          if (typeof decodedToken !== "string") {
            const userId: string = decodedToken.id;
            const user: InferSchemaType<typeof schemas.Users> =
              await schemas.Users.findOne({ _id: userId });
            const post: InferSchemaType<typeof schemas.Posts> =
              await schemas.Posts.findOne({ _id: id });
            if (user && post) {
              if (checkIfUserIsAuthorOrAdmin(user, post)) {
                if (title) {
                  await schemas.Posts.findOneAndUpdate(
                    { _id: id },
                    { title: title }
                  );
                }
                if (content) {
                  await schemas.Posts.findOneAndUpdate(
                    { _id: id },
                    { content: content }
                  );
                }
                if (category) {
                  await schemas.Posts.findOneAndUpdate(
                    { _id: id },
                    { category: category }
                  );
                }
                res.json({ message: `Post ${id} updated` });
              } else {
                res.status(401).json({ message: "Unauthorized" });
              }
            } else {
              res.status(404).json({ message: "User or Post not found" });
            }
          } else {
            res.status(500).json({ message: "Server error" });
          }
        } else {
          res.status(400).json({ message: "Invalid token" });
        }
      } else {
        res.status(400).json({ message: "Invalid ID" });
      }
    } else {
      res.status(400).json({ message: "Invalid token" });
    }
  }
);

module.exports = router;
