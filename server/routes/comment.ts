import { InferSchemaType } from "mongoose";
import * as types from "../interfaces/RouterTypes";
import express, { Router, Request } from "express";
const schemas = require("../models/schemas");
import {
  secretKey,
  checkIfCorrectId,
  checkIfUserIsAuthorOrAdmin,
  checkTokenValidity,
  checkContent,
} from "./utils/ValidityCheck";
import jwt, { JwtPayload } from "jsonwebtoken";
const ObjectId = require("mongoose").Types.ObjectId;
const router: Router = express.Router();
const mqtt = require("mqtt");
const mqttServer = mqtt.connect("mqtt://0.0.0.0:1883");
// HTTP POST to post comments
router.post(
  "/api/posts/id/:postId/comment",
  async (
    req: types.CreateCommentRequest,
    res: types.TypedResponse<types.PostCommentResBody>
  ): Promise<void | types.TypedResponse<types.PostCommentResBody>> => {
    try {
      const { content, author }: { content: string; author: string } = req.body;
      const token: string | undefined = req.headers.authorization;
      const postId: string = req.params.postId;
      const commentData: types.CreateCommentObject = {
        postId: postId,
        content: content,
        author: author,
      };
      if (!content || !author || !checkContent(content)) {
        return res.status(400).json({ message: "Bad request" });
      }

      if (!checkIfCorrectId(postId) || !token || !checkTokenValidity(token)) {
        return res.status(401).json({ message: "Ivalid token or ID" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const postingUser: types.DbUserObject = await schemas.Users.findOne({
        _id: decodedToken._id,
      });

      if (!postId || !postingUser || postingUser.login !== author) {
        return res.status(400).json({ message: "Bad request" });
      }

      const newComment: InferSchemaType<typeof schemas.Comments> =
        new schemas.Comments(commentData);
      const savedComment: InferSchemaType<typeof schemas.Comments> =
        await new schemas.Comments(newComment).save();
      const updateUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOneAndUpdate(
          { _id: postingUser._id },
          { comments: postingUser.comments + 1, lastActive: Date.now() }
        );

      if (!savedComment || !updateUser) {
        return res.status(500).json({ message: "Error creating comment" });
      }

      const mqttServer = mqtt.connect("mqtt://0.0.0.0:1883");
      mqttServer.on("connect", function () {
        console.log("connect");
      });
      const post = await schemas.Posts.aggregate([
        {
          $match: {
            _id: new ObjectId(postId),
          },
        },
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
            authorId: { $arrayElemAt: ["$user._id", 0] },
            title: 1,
          },
        },
      ]);
      if (post[0].authorId.toString() === postingUser._id.toString()) {
        return res
          .status(200)
          .json({ message: "Comment created", comment: savedComment });
      }
      console.log(post);
      const newNotif = {
        userId: post[0].authorId,
        postId: post[0]._id,
        postTitle: post[0].title,
        from: postingUser.login,
      };
      const schemaNotif = new schemas.Notifications(newNotif);
      const saveNotif = await schemaNotif.save();
      mqttServer.publish(
        "getNotifs",
        JSON.stringify({ userId: newNotif.userId })
      );
      res.json({ message: "Comment created", comment: savedComment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// HTTP GET for all comments
router.get(
  "/api/comments",
  async (
    req: Request,
    res: types.TypedResponse<types.AllCommentsResBody>
  ): Promise<void> => {
    const comments: InferSchemaType<typeof schemas.Comments>[] =
      await schemas.Comments.aggregate([
        {
          $sort: {
            date: -1,
          },
        },
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
            postId: 1,
            content: 1,
            author: 1,
            date: 1,
            userId: { $arrayElemAt: ["$user._id", 0] },
            userProfilePicture: {
              $arrayElemAt: ["$user.profilePicture", 0],
            },
          },
        },
      ]);
    if (comments && comments.length > 0) {
      res.json({
        message: `${comments.length} found`,
        comments: comments,
      });
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
    res: types.TypedResponse<types.AggregateCommentsResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    if (!checkIfCorrectId(id)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      const comments: InferSchemaType<typeof schemas.Comments> =
        await schemas.Comments.aggregate([
          {
            $match: {
              postId: id,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
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
              postId: 1,
              content: 1,
              author: 1,
              date: 1,
              userId: { $arrayElemAt: ["$user._id", 0] },
              userProfilePicture: {
                $arrayElemAt: ["$user.profilePicture", 0],
              },
            },
          },
        ]);
      if (comments.length > 0) {
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
        await schemas.Comments.find({ postId: id })
          .sort({ date: -1 })
          .skip(skipValue)
          .limit(10);
      if (comments) {
        res.json({ message: `${comments.length} found`, comments: comments });
      } else {
        res.status(404).json({ message: "No comments found" });
      }
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

// HTTP DELETE for deleting comments
router.delete(
  "/api/comments/id/:id",
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
      const comment: InferSchemaType<typeof schemas.Comments> =
        await schemas.Comments.findOne({ _id: id });
      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });

      if (!comment || !user) {
        return res.status(404).json({ message: "User or Post not found" });
      }
      if (!checkIfUserIsAuthorOrAdmin(user, comment)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const updateUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOneAndUpdate(
          { _id: user._id },
          { comments: user.comments - 1 }
        );
      await schemas.Comments.findOneAndDelete({ _id: id });
      res.json({ message: `Comment ${id} deleted` });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// HTTP PATCH for editing comment
router.patch(
  "/api/comments/id/:id",
  async (
    req: types.EditCommentRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void | types.TypedResponse<types.PatchResBody>> => {
    try {
      const id: string = req.params.id;
      const { content }: { content: string } = req.body;
      const token: string | undefined = req.headers.authorization;

      if (!content || content.length < 50) {
        return res.status(400).json({ message: "Invalid content" });
      }
      if (!token || !checkIfCorrectId || !checkTokenValidity(token)) {
        return res.status(400).json({ message: "Invalid token or ID" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const userId: string = decodedToken._id;
      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });
      const comment: InferSchemaType<typeof schemas.Comments> =
        await schemas.Comments.findOne({ _id: id });

      if (!user || !comment) {
        return res.status(404).json({ message: "User or Post not found" });
      }

      if (!checkIfUserIsAuthorOrAdmin(user, comment)) {
        return res.status(401).json({ message: "Not admin" });
      }

      await schemas.Comments.findOneAndUpdate(
        { _id: id },
        { content: content }
      );

      res.json({ message: `Comment ${id} updated` });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
