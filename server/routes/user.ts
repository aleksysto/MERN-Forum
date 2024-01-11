import { InferSchemaType } from "mongoose";
import * as types from "../interfaces/RouterTypes";
const schemas = require("../models/schemas");
import express, { Router, Request } from "express";
import {
  secretKey,
  checkIfUserIsAccOwnerOrAdmin,
  checkTokenValidity,
  checkIfCorrectId,
  checkIfAdmin,
} from "./utils/ValidityCheck";
import jwt, { JwtPayload } from "jsonwebtoken";
function generateToken(user: types.DbUserObject) {
  const payload: types.GenerateTokenPayload = {
    id: user._id,
    login: user.login,
    email: user.email,
    type: user.type,
  };
  // 7 days -> 7days*24h*60min*60sec
  const expiresIn: number = 7 * 24 * 60 * 60;
  const token: string = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}

const router: Router = express.Router();

// HTTP POST for registering users
router.post(
  "/api/register",
  async (
    req: types.RegisterUserRequest,
    res: types.TypedResponse<types.RegisterResBody>
  ): Promise<void> => {
    const { login, email, password }: types.RegisterUserObject = req.body;
    const userData: types.RegisterUserObject = {
      login: login,
      email: email,
      password: password,
    };

    const newUser: InferSchemaType<typeof schemas.Users> = new schemas.Users(
      userData
    );

    if (login && email && password) {
      const saveUser: InferSchemaType<typeof schemas.Users> =
        await newUser.save();
      if (saveUser) {
        res.json({ message: "User registered successfully", user: saveUser });
      } else {
        res.status(400).json({ message: "Failed to register user" });
      }
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
  }
);

// HTTP POST for logging in
router.post(
  "/api/login",
  async (
    req: types.LoginRequest,
    res: types.TypedResponse<types.LoginResBody>
  ): Promise<void> => {
    const { login, password }: { login: string; password: string } = req.body;
    if (login && password) {
      const foundUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne(
          { login: login, password: password },
          { password: 0, __v: 0 }
        );
      if (foundUser) {
        const token: string = generateToken(foundUser);
        res.json({
          message: "User logged in successfully",
          user: foundUser,
          token: token,
        });
      } else {
        res.status(400).json({ message: "Failed to login user" });
      }
    } else {
      res.status(400).json({ message: "Failed to login user" });
    }
  }
);

// HTTP GET to check for available username/email
router.get(
  "/api/register/checkAvailability",
  async (
    req: types.CheckAvailabilityRequest,
    res: types.TypedResponse<types.AvailableResBody>
  ): Promise<void> => {
    const { type, value }: { type: string; value: string } = req.query;
    const foundData: InferSchemaType<typeof schemas.Users> =
      await schemas.Users.findOne({ [type]: value }, "login email");
    if (foundData) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  }
);

// HTTP GET for top 15 most active users
router.get(
  "/api/users/mostActive",
  async (
    req: Request,
    res: types.TypedResponse<types.ActiveUsersResBody>
  ): Promise<void> => {
    const users: InferSchemaType<typeof schemas.Users> =
      await schemas.Users.find({}).sort({ posts: -1, comments: -1 }).limit(15);
    if (users) {
      res.json({ message: `${users.length} found`, users: users });
    } else {
      res.status(404).json({ message: "No users found" });
    }
  }
);

// HTTP DELETE for deleting users
router.delete(
  "/api/users/id/:id",
  async (
    req: types.DeleteRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void> => {
    const id: string = req.params.id;
    const token: string | undefined = req.headers.authorization;
    if (token) {
      if (checkIfCorrectId(id)) {
        if (checkTokenValidity(token)) {
          const decodedToken: string | JwtPayload = jwt.verify(
            token,
            secretKey
          );
          if (typeof decodedToken !== "string") {
            const userId: string = decodedToken.id;
            const deletingUser: InferSchemaType<typeof schemas.Users> =
              await schemas.Users.findOne({ _id: userId });
            const deletedUser: InferSchemaType<typeof schemas.Users> =
              await schemas.Users.findOne({ _id: id });

            if (deletedUser && deletingUser) {
              if (checkIfUserIsAccOwnerOrAdmin(id, deletingUser)) {
                await schemas.Users.findOneAndDelete({ _id: id });
                res.json({ message: `User ${id} deleted` });
              } else {
                res.status(401).json({ message: "Unauthorized" });
              }
            } else {
              res.status(500).json({ message: "User not found" });
            }
          } else {
            res.status(500).json({ message: "Server error" });
          }
        } else {
          res.status(400).json({ message: "Invalid token" });
        }
      } else {
        res.status(400).json({ message: "Invalid ID" });
      }
    }
  }
);

// HTTP PATCH for editing user
router.patch(
  "/api/users/id/:id",
  async (
    req: types.EditUserRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void> => {
    const { login, password, email, type } = req.body;
    const id: string = req.params.id;
    const token: string | undefined = req.headers.authorization;
    if (token) {
      if (checkIfCorrectId(id)) {
        if (checkTokenValidity(token)) {
          const decodedToken: string | JwtPayload = jwt.verify(
            token,
            secretKey
          );
          if (typeof decodedToken !== "string") {
            const userId: string = decodedToken.id;
            const editingUser: InferSchemaType<typeof schemas.Users> =
              await schemas.Users.findOne({ _id: userId });
            const editedUser: InferSchemaType<typeof schemas.Users> =
              await schemas.Users.findOne({ _id: id });
            if (editingUser && editedUser) {
              if (checkIfUserIsAccOwnerOrAdmin(id, editingUser)) {
                if (login) {
                  await schemas.Users.findOneAndUpdate(
                    { _id: id },
                    { login: login }
                  );
                }
                if (password) {
                  await schemas.Users.findOneAndUpdate(
                    { _id: id },
                    { password: password }
                  );
                }
                if (email) {
                  await schemas.Users.findOneAndUpdate(
                    { _id: id },
                    { email: email }
                  );
                }
                if (checkIfAdmin(editingUser)) {
                  if (type) {
                    await schemas.Users.findOneAndUpdate(
                      { _id: id },
                      { type: type }
                    );
                  }
                }
                res.json({ message: `User ${id} updated` });
              } else {
                res.status(401).json({ message: "Unauthorized" });
              }
            } else {
              res.status(500).json({ message: "User not found" });
            }
          } else {
            res.status(500).json({ message: "Server error" });
          }
        } else {
          res.status(400).json({ message: "Invalid token" });
        }
      } else {
        res.status(400).json({ message: "Invalid ID" });
      }
    }
  }
);

module.exports = router;
