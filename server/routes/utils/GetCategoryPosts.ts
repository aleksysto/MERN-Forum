import * as types from "../../interfaces/RouterTypes";
import mongoose, { InferSchemaType } from "mongoose";
const schemas = require("../../models/schemas");

async function getCategoryPosts(
  req: types.CategoryPostsRequest,
  res: types.TypedResponse<types.AggregatePostsResBody>
): Promise<types.TypedResponse<types.AggregatePostsResBody>> {
  return new Promise<types.TypedResponse<types.AggregatePostsResBody>>(
    async (resolve) => {
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
        resolve(res.json({ message: `${posts.length} found`, posts: posts }));
      } else {
        resolve(res.status(404).json({ message: "No posts found" }));
      }
    }
  );
}

export default getCategoryPosts;
