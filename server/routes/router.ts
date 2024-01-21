import { Router, Request, Response } from "express";
const express = require("express");
const user = require("./user");
const post = require("./post");
const comment = require("./comment");
const schemas = require("../models/schemas");
import * as types from "../interfaces/RouterTypes";
import { InferSchemaType } from "mongoose";
import { storage, upload } from "./utils/Multer";
import path from "path";
import searchAggregation from "./utils/SearchAggregation";
import {
  checkIfAdmin,
  checkIfCorrectId,
  checkTokenValidity,
  secretKey,
} from "./utils/ValidityCheck";
const multer = require("multer");
import jwt, { JwtPayload } from "jsonwebtoken";
import { ReportObject } from "../interfaces/ModelTypes";

const router: Router = express.Router();

// HTTP GET for searching posts
router.get(
  "/api/search",
  async (
    req: types.SearchRequest,
    res: types.TypedResponse<types.PostsResBody>
  ): Promise<void | types.TypedResponse<types.PostsResBody>> => {
    const {
      field,
      q,
      category,
      keywords,
    }: { field: string; q: string; category?: string; keywords?: string } =
      req.query;
    if (!field && !q && !category && !keywords) {
      return res.status(400).json({ message: "Bad request" });
    }
    searchAggregation(res, field, q, category, keywords);
  }
);

// HTTP GET for images
router.get("/api/getImage/:id", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "../../uploads/" + req.params.id));
});

// HTTP GET for reported posts
router.get(
  "/api/reports",
  async (
    req: Request,
    res: types.TypedResponse<{ message: string; reports?: Array<ReportObject> }>
  ): Promise<void | types.TypedResponse<{
    message: string;
    reports?: Array<ReportObject>;
  }>> => {
    try {
      const token: undefined | string = req.headers.authorization;

      if (!token || !checkTokenValidity(token)) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: decodedToken._id });

      if (!user || !checkIfAdmin(user)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const reports: InferSchemaType<typeof schemas.Reports> =
        await schemas.Reports.find();
      res
        .status(200)
        .json({ message: `${reports.length} found`, reports: reports });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// HTTP POST for uploading images
router.post(
  "/api/uploadImage/:id",
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    if (req.file) {
      res.status(200).json({ message: "File uploaded" });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  }
);

// HTTP POST for reporting
router.post(
  "/api/reports",
  async (
    req: types.ReportRequest,
    res: Response<{ message: string }>
  ): Promise<void | Response<{ message: string }>> => {
    try {
      const { type, reportedId }: { type: string; reportedId: string } =
        req.body;
      const token: undefined | string = req.headers.authorization;

      if (
        !token ||
        !type ||
        !reportedId ||
        !checkTokenValidity(token) ||
        !checkIfCorrectId(reportedId)
      ) {
        return res.status(400).json({ message: "Bad request" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const userId: string = decodedToken._id;
      const reportingUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });

      if (!reportingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      switch (type) {
        case "user":
          const reportedUser: InferSchemaType<typeof schemas.Users> =
            await schemas.Users.findOne({
              _id: reportedId,
            });

          if (!reportedUser) {
            return res.status(404).json({ message: "User not found" });
          }

          const reportedUserObject: types.ReportReqObject = {
            type,
            reportedId,
            reportedBy: reportingUser._id,
            reportedObject: reportedUser,
          };
          const newUserReport: InferSchemaType<typeof schemas.Reports> =
            new schemas.Reports(reportedUserObject);
          const savedUser: InferSchemaType<typeof schemas.Reports> =
            await newUserReport.save();

          if (savedUser) {
            return res.status(200).json({ message: "Reported" });
          } else {
            return res.status(400).json({ message: "Server error" });
          }
          break;

        case "post":
          const reportedPost: InferSchemaType<typeof schemas.Posts> =
            await schemas.Posts.findOne({
              _id: reportedId,
            });

          if (!reportedPost) {
            return res.status(404).json({ message: "Post not found" });
          }

          const reportedPostObject: types.ReportReqObject = {
            type,
            reportedId,
            reportedBy: reportingUser._id,
            reportedObject: reportedPost,
          };
          const newPostReport: InferSchemaType<typeof schemas.Reports> =
            new schemas.Reports(reportedPostObject);
          const savedPost: InferSchemaType<typeof schemas.Reports> =
            await newPostReport.save();

          if (savedPost) {
            return res.status(200).json({ message: "Reported" });
          } else {
            return res.status(400).json({ message: "Server error" });
          }

          break;
        case "comment":
          const reportedComment: InferSchemaType<typeof schemas.Comments> =
            await schemas.Comments.findOne({
              _id: reportedId,
            });
          if (!reportedComment) {
            return res.status(404).json({ message: "Comment not found" });
          }

          const reportedCommentObject: types.ReportReqObject = {
            type,
            reportedId,
            reportedBy: reportingUser._id,
            reportedObject: reportedComment,
          };
          const newCommentReport: InferSchemaType<typeof schemas.Reports> =
            new schemas.Reports(reportedCommentObject);
          const saved: InferSchemaType<typeof schemas.Reports> =
            await newCommentReport.save();

          if (saved) {
            return res.status(200).json({ message: "Reported" });
          } else {
            return res.status(400).json({ message: "Server error" });
          }
          break;
        default:
          return res.status(400).json({ message: "Bad request" });
          break;
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// HTTP DELETE for deleting reports
router.delete(
  "/api/reports/:id",
  async (
    req: types.DeleteReportRequest,
    res: types.TypedResponse<{ message: string }>
  ): Promise<void | types.TypedResponse<{ message: string }>> => {
    try {
      const reportId: string = req.params.id;
      const token: undefined | string = req.headers.authorization;

      if (!token || !reportId || !checkTokenValidity(token)) {
        return res.status(400).json({ message: "Bad request" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const userId: string = decodedToken._id;
      const deletingUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });

      if (!deletingUser || !checkIfAdmin(deletingUser)) {
        return res.status(404).json({ message: "User not found" });
      }

      const deletedReport = await schemas.Reports.findOneAndDelete({
        _id: reportId,
      });

      if (!deletedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json({ message: "Report deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.use(user);
router.use(post);
router.use(comment);

module.exports = router;
