import * as types from "../../interfaces/RouterTypes";
import mongoose, { InferSchemaType } from "mongoose";
const schemas = require("../../models/schemas");

async function getUsersComments(
  req: types.UsersLatestRequest,
  res: types.TypedResponse<types.CommentsResBody>
): Promise<types.TypedResponse<types.CommentsResBody>> {
  return new Promise<types.TypedResponse<types.CommentsResBody>>(
    async (resolve) => {
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
}

export default getUsersComments;
