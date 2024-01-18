import * as types from "../../interfaces/RouterTypes";
import mongoose, { InferSchemaType } from "mongoose";
const schemas = require("../../models/schemas");

async function getCategoryPosts(
  req: types.CategoryPostsRequest,
  res: types.TypedResponse<types.AggregatePostsResBody>
): Promise<void> {
  return new Promise<types.AggregatePostObject[]>(async (resolve, reject) => {
    const category: string = req.params.category;
    const posts: InferSchemaType<typeof schemas.Posts> =
      await schemas.Posts.aggregate([
        {
          $match: {
            category: category,
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
    if (posts) {
      resolve(posts);
    } else {
      reject("No posts found");
    }
  })
    .then((postRes) => {
      res.json({ message: `${postRes.length} found`, posts: postRes });
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
}
export default getCategoryPosts;
