import { Router, Request, Response } from "express";
const express = require("express");
const user = require("./user");
const post = require("./post");
const comment = require("./comment");
const schemas = require("../models/schemas");
import * as types from "../interfaces/RouterTypes";
import { InferSchemaType } from "mongoose";
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

import { storage, upload } from "./utils/Multer";
import path from "path";
import searchAggregation from "./utils/SearchAggregation";
const multer = require("multer");

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

router.get("/api/getImage/:id", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "../../uploads/" + req.params.id));
});

router.use(user);
router.use(post);
router.use(comment);

module.exports = router;
