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
  ): Promise<void> => {
    const {
      field,
      q,
      category,
      keywords,
    }: { field: string; q: string; category?: string; keywords?: string } =
      req.query;
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
  ) => {
    const token: undefined | string = req.headers.authorization;
    if (token) {
      if (checkTokenValidity(token)) {
        const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);
        if (typeof decodedToken !== "string") {
          const user: InferSchemaType<typeof schemas.Users> =
            await schemas.Users.findOne({ _id: decodedToken._id });
          if (checkIfAdmin(user)) {
            const reports: InferSchemaType<typeof schemas.Reports> =
              await schemas.Reports.find();
            res
              .status(200)
              .json({ message: `${reports.length} found`, reports: reports });
          } else {
            res.status(403).json({ message: "Forbidden" });
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
  ): Promise<void> => {
    const { type, reportedId }: { type: string; reportedId: string } = req.body;
    const token: undefined | string = req.headers.authorization;
    if (token && type && reportedId) {
      if (checkTokenValidity(token)) {
        const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);
        if (typeof decodedToken !== "string") {
          const userId: string = decodedToken._id;
          const reportingUser: InferSchemaType<typeof schemas.Users> =
            await schemas.Users.findOne({ _id: userId });
          if (reportingUser) {
            switch (type) {
              case "user":
                const reportedUser: InferSchemaType<typeof schemas.Users> =
                  await schemas.Users.findOne({
                    _id: reportedId,
                  });
                if (reportedUser && reportingUser) {
                  const reportedObject: types.ReportReqObject = {
                    type,
                    reportedId,
                    reportedBy: reportingUser._id,
                    reportedObject: reportedUser,
                  };
                  const newReport: InferSchemaType<typeof schemas.Users> =
                    new schemas.Reports(reportedObject);
                  const saved: InferSchemaType<typeof schemas.Users> =
                    await newReport.save();
                  if (saved) {
                    res.status(200).json({ message: "Reported" });
                  } else {
                    res.status(400).json({ message: "Server error" });
                  }
                } else {
                  res.status(400).json({ message: "User not found" });
                }
                break;
              case "post":
                const reportedPost: InferSchemaType<typeof schemas.Posts> =
                  await schemas.Posts.findOne({
                    _id: reportedId,
                  });
                if (reportedPost && reportingUser) {
                  const reportedObject: types.ReportReqObject = {
                    type,
                    reportedId,
                    reportedBy: reportingUser._id,
                    reportedObject: reportedPost,
                  };
                  const newReport: InferSchemaType<typeof schemas.Users> =
                    new schemas.Reports(reportedObject);
                  const saved: InferSchemaType<typeof schemas.Users> =
                    await newReport.save();
                  if (saved) {
                    res.status(200).json({ message: "Reported" });
                  } else {
                    res.status(400).json({ message: "Server error" });
                  }
                } else {
                  res.status(400).json({ message: "Post not found" });
                }
                break;
              case "comment":
                const reportedComment: InferSchemaType<
                  typeof schemas.Comments
                > = await schemas.Comments.findOne({
                  _id: reportedId,
                });
                if (reportedComment && reportingUser) {
                  const reportedObject: types.ReportReqObject = {
                    type,
                    reportedId,
                    reportedBy: reportingUser._id,
                    reportedObject: reportedComment,
                  };
                  const newReport: InferSchemaType<typeof schemas.Users> =
                    new schemas.Reports(reportedObject);
                  const saved: InferSchemaType<typeof schemas.Users> =
                    await newReport.save();
                  if (saved) {
                    res.status(200).json({ message: "Reported" });
                  } else {
                    res.status(400).json({ message: "Server error" });
                  }
                } else {
                  res.status(400).json({ message: "Comment not found" });
                }
                break;
              default:
                res.status(400).json({ message: "Bad request" });
                break;
            }
          } else {
            res.status(404).json({ message: "User not found" });
          }
        } else {
          res.status(401).json({ message: "Server error" });
        }
      } else {
        res.status(400).json({ message: "Invalid token" });
      }
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  }
);

// HTTP DELETE for deleting reports
router.delete(
  "/api/reports/:id",
  async (
    req: types.DeleteReportRequest,
    res: types.TypedResponse<{ message: string }>
  ): Promise<void> => {
    const reportId: string = req.params.id;
    const token: undefined | string = req.headers.authorization;
    if (token && reportId) {
      if (checkTokenValidity(token)) {
        const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);
        if (typeof decodedToken !== "string") {
          const userId: string = decodedToken._id;
          const deletingUser: InferSchemaType<typeof schemas.Users> =
            await schemas.Users.findOne({ _id: userId });
          if (deletingUser && checkIfAdmin(deletingUser)) {
            const deletedReport = await schemas.Reports.findOneAndDelete({
              _id: reportId,
            });
            if (deletedReport) {
              res.status(200).json({ message: "Report deleted" });
            } else {
              res.status(404).json({ message: "Report not found" });
            }
          } else {
            res.status(404).json({ message: "User not found" });
          }
        } else {
          res.status(401).json({ message: "Server error" });
        }
      } else {
        res.status(400).json({ message: "Invalid token" });
      }
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  }
);

router.use(user);
router.use(post);
router.use(comment);

module.exports = router;
