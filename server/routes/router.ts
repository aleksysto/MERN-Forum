import { Router, Request, Response } from "express";
import { Schema, InferSchemaType } from "mongoose";
import {
    CheckAvailabilityRequest,
  RegisterUserObject,
  RegisterUserRequest,
} from "../interfaces/RouterTypes";

const express = require("express");
const schemas = require("../models/schemas");
const router: Router = express.Router();

// HTTP POST for registering users
router.post(
  "/api/register",
  async (req: RegisterUserRequest, res: Response): Promise<void> => {
    const { login, email, password }: RegisterUserObject = req.body;
    const userData: RegisterUserObject = {
      login: login,
      email: email,
      password: password,
    };

    const newUser: InferSchemaType<typeof schemas.Users> = new schemas.Users(
      userData
    );

    const saveUser: InferSchemaType<typeof schemas.Users> =
      await newUser.save();
    if (saveUser) {
      res.json({ message: "User registered successfully", user: saveUser });
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
  }
);

// HTTP GET to check for available username/email
router.get(
  "/api/register/checkAvailability",
  async (req: CheckAvailabilityRequest, res: Response): Promise<void> => {
    const { type, value }: { type: string; value: string } = req.query;
    const foundData: InferSchemaType<typeof schemas.Users> = await schemas.Users.findOne({ [type]: value });
    if (foundData) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  }
);

module.exports = router;
