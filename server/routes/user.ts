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
  checkPassword,
  checkEmail,
  checkLogin,
  checkIfUserIsAuthorOrAdmin,
} from "./utils/ValidityCheck";
import generateToken from "./utils/TokenGeneration";
import jwt, { JwtPayload } from "jsonwebtoken";
import { comparePassword, encryptPassword } from "./utils/PasswordEncryption";
import checkAvailable from "./utils/CheckAvailable";

const router: Router = express.Router();

// HTTP POST for registering users
router.post(
  "/api/register",
  async (
    req: types.RegisterUserRequest,
    res: types.TypedResponse<types.RegisterResBody>
  ): Promise<void | types.TypedResponse<types.RegisterResBody>> => {
    try {
      const {
        login,
        email,
        password,
        profilePicture,
      }: types.RegisterUserObject = req.body;

      if (
        !login ||
        !email ||
        !password ||
        !checkLogin(login) ||
        !checkEmail(email) ||
        !checkPassword(password)
      ) {
        return res.status(400).json({ message: "Bad request" });
      }

      const checkDuplicate = await schemas.Users.findOne({
        $or: [{ login: login }, { email: email }],
      });

      if (checkDuplicate) {
        return res.status(409).json({ message: "User already exists" });
      }

      const encryptedPassword: string = await encryptPassword(password);
      const userData: types.RegisterUserObject = {
        login: login,
        email: email,
        password: encryptedPassword,
        profilePicture: profilePicture || "default.jpg",
      };
      const newUser: InferSchemaType<typeof schemas.Users> = new schemas.Users(
        userData
      );
      const saveUser: InferSchemaType<typeof schemas.Users> =
        await newUser.save();
      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ login: login }, { password: 0 });

      if (!saveUser || !user) {
        return res.status(400).json({ message: "Failed to register user" });
      }

      res.json({
        message: "User registered successfully",
        user: user,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// HTTP POST for logging in
router.post(
  "/api/login",
  async (
    req: types.LoginRequest,
    res: types.TypedResponse<types.LoginResBody>
  ): Promise<void | types.TypedResponse<types.LoginResBody>> => {
    try {
      const { login, password }: { login: string; password: string } = req.body;

      if (!login || !password) {
        return res.status(400).json({ message: "Bad request" });
      }

      const foundUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ login: login }, { password: 1 });

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const comparedPasswords: boolean = await comparePassword(
        password,
        foundUser.password
      );

      if (!comparedPasswords) {
        return res.status(401).json({ message: "Wrong password" });
      }

      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ login: login }, { password: 0 });
      const token: string = generateToken(user);

      res.json({
        message: "User logged in successfully",
        user: user,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// HTTP GET to check for available username/email
router.get("/api/register/checkAvailability", checkAvailable);

// HTTP GET for all users
router.get(
  "/api/users",
  async (req: Request, res: types.TypedResponse<types.UsersArrayResBody>) => {
    const users = await schemas.Users.find({}, { password: 0 }).sort({
      lastActive: -1,
    });
    if (users) {
      res.json({ message: `${users.length} found`, users: users });
    } else {
      res.status(404).json({ message: "No users found" });
    }
  }
);
// HTTP GET for user
router.get(
  "/api/users/id/:id",
  async (
    req: types.GetUserRequest,
    res: types.TypedResponse<types.GetUserResBody>
  ): Promise<void | types.TypedResponse<types.GetUserResBody>> => {
    try {
      const id: string = req.params.id;

      if (!checkIfCorrectId) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const user: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: id }, { password: 0, email: 0 });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User found", user: user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// HTTP GET for top 15 most active users
router.get(
  "/api/users/mostActive",
  async (
    req: Request,
    res: types.TypedResponse<types.UsersArrayResBody>
  ): Promise<void> => {
    const users: InferSchemaType<typeof schemas.Users> =
      await schemas.Users.find({}, { password: 0, email: 0 })
        .sort({ posts: -1, comments: -1 })
        .limit(15);
    if (users) {
      res.json({ message: `${users.length} found`, users: users });
    } else {
      res.status(404).json({ message: "No users found" });
    }
  }
);
// HTTP GET for top 15 of combined activity users
router.get(
  "/api/users/combinedActivity",
  async (
    req: Request,
    res: types.TypedResponse<types.UsersArrayResBody>
  ): Promise<void> => {
    const users: InferSchemaType<typeof schemas.Users> =
      await schemas.Users.aggregate([
        {
          $project: {
            _id: 1,
            posts: 1,
            comments: 1,
            login: 1,
            profilePicture: 1,
            entryDate: 1,
            combinedActivity: { $add: ["$posts", "$comments"] },
          },
        },
        { $sort: { combinedActivity: -1 } },
        { $limit: 10 },
      ]);
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
  ): Promise<void | types.TypedResponse<types.PatchResBody>> => {
    try {
      const id: string = req.params.id;
      const token: string | undefined = req.headers.authorization;

      if (
        !id ||
        !token ||
        !checkIfCorrectId(id) ||
        !checkTokenValidity(token)
      ) {
        return res.status(400).json({ message: "Invalid token or ID" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const userId: string = decodedToken._id;
      const deletingUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });
      const deletedUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: id });

      if (!deletedUser || !deletingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!checkIfUserIsAccOwnerOrAdmin(id, deletingUser)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await schemas.Users.findOneAndDelete({ _id: id });
      res.json({ message: `User ${id} deleted` });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// HTTP PATCH for editing user
router.patch(
  "/api/users/id/:id",
  async (
    req: types.EditUserRequest,
    res: types.TypedResponse<types.PatchResBody>
  ): Promise<void | types.TypedResponse<types.PatchResBody>> => {
    try {
      const { login, password, email, type, profilePicture } = req.body;
      const id: string = req.params.id;
      const token: string | undefined = req.headers.authorization;

      if (!login && !password && !email && !type && !profilePicture) {
        return res.status(400).json({ message: "No data provided" });
      }

      if (!token || !checkIfCorrectId(id) || !checkTokenValidity(token)) {
        return res.status(401).json({ message: "Invalid token or ID" });
      }

      const decodedToken: string | JwtPayload = jwt.verify(token, secretKey);

      if (typeof decodedToken === "string") {
        return res.status(500).json({ message: "Server error" });
      }

      const userId: string = decodedToken._id;
      const editingUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: userId });
      const editedUser: InferSchemaType<typeof schemas.Users> =
        await schemas.Users.findOne({ _id: id });

      if (!editingUser || !editedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!checkIfUserIsAccOwnerOrAdmin(id, editingUser)) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      if (login && checkLogin(login)) {
        await schemas.Users.findOneAndUpdate({ _id: id }, { login: login });
      }
      if (password && checkPassword(password)) {
        const encryptedPassword = await encryptPassword(password);
        await schemas.Users.findOneAndUpdate(
          { _id: id },
          { password: encryptedPassword }
        );
      }
      if (email && checkEmail(email)) {
        await schemas.Users.findOneAndUpdate({ _id: id }, { email: email });
      }
      if (profilePicture) {
        await schemas.Users.findOneAndUpdate(
          { _id: id },
          { profilePicture: profilePicture }
        );
      }
      if (checkIfAdmin(editingUser)) {
        if (type) {
          await schemas.Users.findOneAndUpdate({ _id: id }, { type: type });
        }
      }
      res.json({ message: "User updated" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/api/generateToken",
  async (
    req: types.TokenRequest,
    res: types.TypedResponse<
      { token: string; message: string } | { message: string }
    >
  ): Promise<string | void> => {
    return new Promise<string>(async (resolve, reject) => {
      const id: string = req.body.id;
      if (!checkIfCorrectId(id)) {
        reject("Bad request");
      } else {
        const user: InferSchemaType<typeof schemas.Users> =
          await schemas.Users.findOne({ _id: id }, { password: 0 });
        if (user) {
          const token: string = generateToken(user);
          resolve(token);
        } else {
          reject("User not found");
        }
      }
    })
      .then((token: string) => {
        res.json({ token: token, message: "Token generated" });
      })
      .catch((err: string) => {
        res.status(500).json({ message: err });
      });
  }
);

module.exports = router;
