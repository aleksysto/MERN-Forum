import { Router, Request, Response } from "express";
import { Schema, InferSchemaType } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;
import * as types from "../interfaces/RouterTypes";
import {
  CommentObject,
  PostObject,
  UserObject,
} from "../interfaces/ModelTypes";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

const secretKey: string = "kluczpodwannom";
function generateToken(user: types.DbUserObject) {
  const payload: types.GenerateTokenPayload = {
    id: user._id,
    login: user.login,
    email: user.email,
    type: user.type,
  };
  // 7 days -> 7days*24h*60min*60sec
  const expiresIn: number = 7 * 24 * 60 * 60;
  const token: string = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}

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

    if (login && email && password) {
      const saveUser: InferSchemaType<typeof schemas.Users> =
        await newUser.save();
      if (saveUser) {
        res.json({ message: "User registered successfully", user: saveUser });
      } else {
        res.status(400).json({ message: "Failed to register user" });
      }
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
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
    if (login && password) {
      const foundUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne(
          { login: login, password: password },
          { password: 0, __v: 0 }
        );
      if (foundUser) {
        console.log(foundUser);
        const token: string = generateToken(foundUser);
        res.json({
          message: "User logged in successfully",
          user: foundUser,
          token: token,
        });
      } else {
        res.status(400).json({ message: "Failed to login user" });
      }
    } else {
      res.status(400).json({ message: "Failed to login user" });
    }
  }
);

// HTTP POST for creating new posts
router.post(
  "/api/posts/:category",
  async (req: types.CreatePostRequest, res: Response): Promise<void> => {
    const { title, content, author }: types.CreatePostObject = req.body;
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
    if (title && content && author) {
      const savedPost: InferSchemaType<typeof schemas.Posts> =
        await newPost.save();
      if (savedPost) {
        res.json({ message: "Post created" });
      } else {
        res.status(500).json({ message: "Error creating post" });
      }
    } else {
      res.status(500).json({ message: "Error creating post" });
    }
  }
);

// HTTP POST to post comments
router.post(
  "/api/posts/id/:postId/comment",
  async (
    req: types.CreateCommentRequest,
    res: types.TypedResponse<types.PostCommentResBody>
  ): Promise<void> => {
    const { content, author }: { content: string; author: string } = req.body;
    const postId: string = req.params.postId;
    const newComment = {
      postId: postId,
      content: content,
      author: author,
    };
    if (!checkIfCorrectId(postId)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      if (content && author && postId) {
        const savedComment: InferSchemaType<typeof schemas.Comments> =
          await new schemas.Comments(newComment).save();
        if (savedComment) {
          res.json({ message: "Comment created", comment: savedComment });
        } else {
          res.status(500).json({ message: "Error creating comment" });
        }
      } else {
        res.status(500).json({ message: "Bad request" });
      }
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

// HTTP GET for all posts comments
router.get(
  "/api/posts/:id/comments",
  async (
    req: types.IdPostsRequest,
    res: types.TypedResponse<types.CommentsResBody>
  ): Promise<void> => {
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
  async (
    req: types.CommentsPageRequest,
    res: types.TypedResponse<types.CommentsResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    if (!checkIfCorrectId(id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const page: number = parseInt(req.params.page);
      const skipValue: number = (page - 1) * 10;
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
  async (
    req: types.UsersLatestRequest,
    res: types.TypedResponse<types.CommentsResBody>
  ): Promise<void> => {
    const username: string = req.params.username;
    const comments: InferSchemaType<typeof schemas.Comments> =
      await schemas.Comments.find({ author: username });
    if (comments) {
      res.json({ message: `${comments.length} found`, comments: comments });
    } else {
      res.status(404).json({ message: "No comments found" });
    }
  }
);

// HTTP GET for top 15 most active users
router.get(
  "/api/users/mostActive",
  async (req: Request, res): Promise<void> => {
    const users: InferSchemaType<typeof schemas.Users> =
      await schemas.Users.find({}).sort({ posts: -1, comments: -1 }).limit(15);
    if (users) {
      res.json({ message: `${users.length} found`, users: users });
    } else {
      res.status(404).json({ message: "No users found" });
    }
  }
);

// HTTP DELETE for deleting posts
router.delete(
  "/api/posts/id/:id",
  async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const token: string | undefined = req.headers.authorization
      ?.split(" ")[1]
      .split('"')[1];
    if (token) {
      if (checkIfCorrectId(id)) {
        if (checkTokenValidity(token)) {
          const decodedToken: string | JwtPayload = jwt.verify(
            token,
            secretKey
          );
          if (typeof decodedToken !== "string") {
            const userId = decodedToken.id;

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

// HTTP DELETE for deleting comments
// HTTP DELETE for deleting users

// HTTP PATCH for editing post
// HTTP PATCH for editing user
// HTTP PATCH for editing comment
function checkIfCorrectId(id: string): boolean {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function checkIfUserIsAuthorOrAdmin(
  user: UserObject,
  object: PostObject | CommentObject
): boolean {
  if (user.type === "admin" || user.type === "moderator") {
    return true;
  } else if (user.login === object.author) {
    return true;
  } else {
    return false;
  }
}

function checkTokenValidity(token: string): boolean {
  try {
    jwt.verify(token, secretKey);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = router;
