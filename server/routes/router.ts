import { Router } from "express";
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
    const defaultCategory: "" = "";
    const assignedCategory: string = category || defaultCategory;
    if (keywords) {
      const searchKeywords: string = keywords;
      const keywordsPosts: InferSchemaType<typeof schemas.Posts>[] =
        await schemas.Posts.aggregate([
          {
            $match: {
              $text: {
                $search: searchKeywords,
              },
            },
          },
        ]);
      res.json({
        message: `${keywordsPosts.length} found`,
        posts: keywordsPosts,
      });
    } else {
      if (field && q) {
        switch (field) {
          case "title":
            const searchTitle: string = q;
            const titlePosts: InferSchemaType<typeof schemas.Posts>[] =
              await schemas.Posts.aggregate([
                {
                  $match: {
                    title: {
                      $regex: searchTitle,
                      $options: "i",
                    },
                    category: {
                      $regex: assignedCategory,
                      $options: "i",
                    },
                  },
                },
              ]);
            res.json({
              message: `${titlePosts.length} found`,
              posts: titlePosts,
            });
            break;
          case "content":
            const searchContent: string = q;
            const contentPosts: InferSchemaType<typeof schemas.Posts>[] =
              await schemas.Posts.aggregate([
                {
                  $match: {
                    content: {
                      $regex: searchContent,
                      $options: "i",
                    },
                    category: {
                      $regex: assignedCategory,
                      $options: "i",
                    },
                  },
                },
              ]);
            res.json({
              message: `${contentPosts.length} found`,
              posts: contentPosts,
            });
            break;
          case "author":
            const searchAuthor: string = q;
            const authorPosts = await schemas.Posts.aggregate([
              {
                $match: {
                  author: {
                    $regex: searchAuthor,
                    $options: "i",
                  },
                  category: {
                    $regex: assignedCategory,
                    $options: "i",
                  },
                },
              },
            ]);
            res.json({
              message: `${authorPosts.length} found`,
              posts: authorPosts,
            });
            break;
          case "date":
            const searchDate: Date = new Date(q);
            const datePosts: InferSchemaType<typeof schemas.Posts>[] =
              await schemas.Posts.aggregate([
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [{ $year: "$date" }, searchDate.getFullYear()],
                        },
                        {
                          $eq: [{ $month: "$date" }, searchDate.getMonth() + 1],
                        },
                        {
                          $eq: [{ $dayOfMonth: "$date" }, searchDate.getDate()],
                        },
                      ],
                    },
                    category: {
                      $regex: assignedCategory,
                      $options: "i",
                    },
                  },
                },
              ]);
            res.json({
              message: `${datePosts.length} found`,
              posts: datePosts,
            });
            break;
          default:
            res.status(400).json({ message: "Bad request" });
            break;
        }
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    }
  }
);

router.use(user);
router.use(post);
router.use(comment);

module.exports = router;
