import { InferSchemaType } from "mongoose";
import * as types from "../interfaces/RouterTypes";
import express, { Router } from "express";
const schemas = require("../models/schemas");
import {
  secretKey,
  checkIfCorrectId,
  checkIfUserIsAuthorOrAdmin,
  checkTokenValidity,
} from "./utils/ValidityCheck";
import jwt, { JwtPayload } from "jsonwebtoken";

const router: Router = express.Router();
// HTTP POST to post comments
router.post(
  "/api/posts/id/:postId/comment",
  async (
    req: types.CreateCommentRequest,
    res: types.TypedResponse<types.PostCommentResBody>
  ): Promise<void> => {
    const { content, author }: { content: string; author: string } = req.body;
    const token: string | undefined = req.headers.authorization;
    const postId: string = req.params.postId;
    const commentData: types.CreateCommentObject = {
      postId: postId,
      content: content,
      author: author,
    };
    const newComment: InferSchemaType<typeof schemas.Comments> =
      new schemas.Comments(commentData);
    if (!checkIfCorrectId(postId)) {
      res.status(400).json({ message: "Invalid ID" });
    } else {
      if (token) {
        if (checkTokenValidity(token)) {
          const decodedToken: string | JwtPayload = jwt.verify(
            token,
            secretKey
          );
          if (typeof decodedToken !== "string") {
            const postingUser: types.DbUserObject = await schemas.Users.findOne(
              {
                _id: decodedToken.id,
              }
            );
            if (
              content &&
              author &&
              postId &&
              postingUser &&
              postingUser.login === author
            ) {
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
  }
);
const ObjectId = require("mongoose").Types.ObjectId;
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

// HTTP DELETE for deleting comments
router.delete(
  "/api/comments/id/:id",
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

            const comment: InferSchemaType<typeof schemas.Comments> =
              await schemas.Comments.findOne({ _id: id });

            const user: InferSchemaType<typeof schemas.Users> =
              await schemas.Users.findOne({ _id: userId });

            if (comment && user) {
              if (checkIfUserIsAuthorOrAdmin(user, comment)) {
                await schemas.Comments.findOneAndDelete({ _id: id });
                res.json({ message: `Comment ${id} deleted` });
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

// HTTP PATCH for editing comment
router.patch(
  "/api/comments/id/:id",
  async (
    req: types.EditCommentRequest,
    res: types.TypedResponse<types.PatchResBody>
  ) => {
    const id: string = req.params.id;
    const { content }: { content: string } = req.body;
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
            const comment: InferSchemaType<typeof schemas.Comments> =
              await schemas.Comments.findOne({ _id: id });
            if (user && comment) {
              if (checkIfUserIsAuthorOrAdmin(user, comment)) {
                if (content) {
                  await schemas.Comments.findOneAndUpdate(
                    { _id: id },
                    { content: content }
                  );
                }
                res.json({ message: `Comment ${id} updated` });
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
