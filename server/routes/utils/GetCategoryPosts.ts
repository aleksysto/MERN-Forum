import * as types from "../../interfaces/RouterTypes";
import mongoose, { InferSchemaType } from "mongoose";
const schemas = require("../../models/schemas");

async function getCategoryPosts(
  req: types.CategoryPostsRequest,
  res: types.TypedResponse<types.PostsResBody>
): Promise<types.TypedResponse<types.PostsResBody>> {
  return new Promise<types.TypedResponse<types.PostsResBody>>(
    async (resolve) => {
      const category: string = req.params.category;
      const posts: InferSchemaType<typeof schemas.Posts> =
        await schemas.Posts.find({ category: category });
      if (posts) {
        resolve(res.json({ message: `${posts.length} found`, posts: posts }));
      } else {
        resolve(res.status(404).json({ message: "No posts found" }));
      }
    }
  );
}

export default getCategoryPosts;
