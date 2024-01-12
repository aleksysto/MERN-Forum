import * as types from "../../interfaces/RouterTypes";
import mongoose, { InferSchemaType } from "mongoose";
const schemas = require("../../models/schemas");

async function checkAvailable(
  req: types.CheckAvailabilityRequest,
  res: types.TypedResponse<types.AvailableResBody>
): Promise<types.TypedResponse<types.AvailableResBody>> {
  return new Promise<types.TypedResponse<types.AvailableResBody>>(
    async (resolve) => {
      const { type, value }: { type: "email" | "login"; value: string } =
        req.query;
      if (type && value && (type === "email" || type === "login")) {
        const foundData: InferSchemaType<typeof schemas.Users> =
          await schemas.Users.findOne({ [type]: value }, "login email");
        if (foundData) {
          resolve(res.json({ available: false }));
        } else {
          resolve(res.json({ available: true }));
        }
      } else {
        resolve(res.json({ available: false }));
      }
    }
  );
}

export default checkAvailable;
