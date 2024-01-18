import * as types from "../../interfaces/RouterTypes";
import mongoose, { InferSchemaType } from "mongoose";
const schemas = require("../../models/schemas");

async function checkAvailable(
  req: types.CheckAvailabilityRequest,
  res: types.TypedResponse<types.AvailableResBody>
): Promise<void> {
  return new Promise<boolean>(async (resolve, reject) => {
    const { type, value }: { type: "email" | "login"; value: string } =
      req.query;
    if (type && value && (type === "email" || type === "login")) {
      const foundData: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ [type]: value }, "login email");
      if (foundData) {
        reject(false);
      } else {
        resolve(true);
      }
    } else {
      reject(false);
    }
  })
    .then((resAvailable) => {
      res.json({ available: resAvailable });
    })
    .catch((notAvailable) => {
      res.json({ available: notAvailable });
    });
}
// res.json({ available: false })
export default checkAvailable;
