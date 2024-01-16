import { InferSchemaType } from "mongoose";
import * as types from "../../interfaces/RouterTypes";
const schemas = require("../../models/schemas");
async function searchAggregation(
  res: types.TypedResponse<types.PostsResBody>,
  field: string,
  q: string,
  category: string | undefined,
  keywords?: string
): Promise<void> {
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
            category: {
              $regex: assignedCategory,
              $options: "i",
            },
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
    if (keywordsPosts.length === 0) {
      res.status(404).json({ message: "No posts found" });
    } else {
      res.json({
        message: `${keywordsPosts.length} found`,
        posts: keywordsPosts,
      });
    }
  } else if (field === "date" && q) {
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
            userProfilePicture: {
              $arrayElemAt: ["$user.profilePicture", 0],
            },
          },
        },
      ]);
    if (datePosts.length === 0) {
      res.status(404).json({ message: "No posts found" });
    } else {
      res.json({
        message: `${datePosts.length} found`,
        posts: datePosts,
      });
    }
  } else if (field && q) {
    const search: string = q;
    const posts: InferSchemaType<typeof schemas.Posts>[] =
      await schemas.Posts.aggregate([
        {
          $match: {
            [field]: {
              $regex: search,
              $options: "i",
            },
            category: {
              $regex: assignedCategory,
              $options: "i",
            },
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
            category: 1,
            title: 1,
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
    if (posts.length === 0) {
      res.status(404).json({ message: "No posts found" });
    } else {
      res.json({
        message: `${posts.length} found`,
        posts: posts,
      });
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
}
export default searchAggregation;

// else {
//     if (field && q) {
//       switch (field) {
//         case "title":
//           const searchTitle: string = q;
//           const titlePosts: InferSchemaType<typeof schemas.Posts>[] =
//             await schemas.Posts.aggregate([
//               {
//                 $match: {
//                   title: {
//                     $regex: searchTitle,
//                     $options: "i",
//                   },
//                   category: {
//                     $regex: assignedCategory,
//                     $options: "i",
//                   },
//                 },
//               },
//               {
//                 $lookup: {
//                   from: "users",
//                   localField: "author",
//                   foreignField: "login",
//                   as: "user",
//                 },
//               },
//               {
//                 $project: {
//                   _id: 1,
//                   category: 1,
//                   title: 1,
//                   content: 1,
//                   author: 1,
//                   date: 1,
//                   userId: { $arrayElemAt: ["$user._id", 0] },
//                   userProfilePicture: {
//                     $arrayElemAt: ["$user.profilePicture", 0],
//                   },
//                 },
//               },
//             ]);
//           if (titlePosts.length === 0) {
//             res.status(404).json({ message: "No posts found" });
//           } else {
//             res.json({
//               message: `${titlePosts.length} found`,
//               posts: titlePosts,
//             });
//           }
//           break;
//         case "content":
//           const searchContent: string = q;
//           const contentPosts: InferSchemaType<typeof schemas.Posts>[] =
//             await schemas.Posts.aggregate([
//               {
//                 $match: {
//                   content: {
//                     $regex: searchContent,
//                     $options: "i",
//                   },
//                   category: {
//                     $regex: assignedCategory,
//                     $options: "i",
//                   },
//                 },
//               },
//               {
//                 $lookup: {
//                   from: "users",
//                   localField: "author",
//                   foreignField: "login",
//                   as: "user",
//                 },
//               },
//               {
//                 $project: {
//                   _id: 1,
//                   category: 1,
//                   title: 1,
//                   content: 1,
//                   author: 1,
//                   date: 1,
//                   userId: { $arrayElemAt: ["$user._id", 0] },
//                   userProfilePicture: {
//                     $arrayElemAt: ["$user.profilePicture", 0],
//                   },
//                 },
//               },
//             ]);
//           if (contentPosts.length === 0) {
//             res.status(404).json({ message: "No posts found" });
//           } else {
//             res.json({
//               message: `${contentPosts.length} found`,
//               posts: contentPosts,
//             });
//           }
//           break;
//         case "author":
//           const searchAuthor: string = q;
//           const authorPosts = await schemas.Posts.aggregate([
//             {
//               $match: {
//                 author: {
//                   $regex: searchAuthor,
//                   $options: "i",
//                 },
//                 category: {
//                   $regex: assignedCategory,
//                   $options: "i",
//                 },
//               },
//             },
//             {
//               $lookup: {
//                 from: "users",
//                 localField: "author",
//                 foreignField: "login",
//                 as: "user",
//               },
//             },
//             {
//               $project: {
//                 _id: 1,
//                 category: 1,
//                 title: 1,
//                 content: 1,
//                 author: 1,
//                 date: 1,
//                 userId: { $arrayElemAt: ["$user._id", 0] },
//                 userProfilePicture: {
//                   $arrayElemAt: ["$user.profilePicture", 0],
//                 },
//               },
//             },
//           ]);
//           if (authorPosts.length === 0) {
//             res.status(404).json({ message: "No posts found" });
//           } else {
//             res.json({
//               message: `${authorPosts.length} found`,
//               posts: authorPosts,
//             });
//           }
//           break;
//         case "date":
//
//           break;
//         default:
//           res.status(400).json({ message: "Bad request" });
//           break;
//       }
//     }
//   }
