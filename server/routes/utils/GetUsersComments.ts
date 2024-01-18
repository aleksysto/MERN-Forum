import { CommentObject } from "../../interfaces/ModelTypes";
import * as types from "../../interfaces/RouterTypes";
import mongoose, { InferSchemaType } from "mongoose";
const schemas = require("../../models/schemas");

async function getUsersComments(
  req: types.UsersLatestRequest,
  res: types.TypedResponse<types.CommentsResBody>
): Promise<void> {
  return new Promise<CommentObject[]>(async (resolve, reject) => {
    const username: string = req.params.username;
    const comments: InferSchemaType<typeof schemas.Comments> =
      await schemas.Comments.find({ author: username });
    if (comments) {
      resolve(comments);
    } else {
      reject("No comments found");
    }
  })
    .then((resComments) => {
      res.json({
        message: `${resComments.length} found`,
        comments: resComments,
      });
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
}
export default getUsersComments;
