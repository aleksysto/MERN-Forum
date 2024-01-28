import { Express } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
import cors, { CorsOptions } from "cors";
const router = require("./routes/router");
const express = require("express");
const bodyParser = require("body-parser");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");
import * as types from "./interfaces/RouterTypes";
import { error } from "console";
import jwt from "jsonwebtoken";
import {
  checkIfAdmin,
  checkTokenValidity,
  secretKey,
} from "./routes/utils/ValidityCheck";
const schemas = require("./models/schemas");
require("dotenv/config");

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("DB Connected"))
  .catch((err: Error): void => console.log(err));

app.use(cors(corsOptions));
app.use("/", router);

const port: string | number = process.env.PORT || 4000;
const server: Server<typeof IncomingMessage, typeof ServerResponse> =
  app.listen(port, (): void => {
    console.log(`Server started on port ${port}`);
  });

const mqtt = require("mqtt");
const serverMqtt = mqtt.connect("mqtt://0.0.0.0:1883");
serverMqtt.on("connect", (err: Error) => {
  if (!err) {
    console.log("connected");
  }
});

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

serverMqtt.subscribe("postMessages", (err: Error) => {
  if (!err) {
    console.log("subscribed to messages");
  }
});
serverMqtt.subscribe("getMessages", (err: Error) => {
  if (!err) {
    console.log("subscribed to messages");
  }
});
serverMqtt.subscribe("dataMessages", (err: Error) => {
  if (!err) {
    console.log("subscribed to messages");
  }
});
serverMqtt.subscribe("deleteMessages", (err: Error) => {
  if (!err) {
    console.log("subscribed to messages");
  }
});
serverMqtt.subscribe("randomPost", (err: Error) => {
  if (!err) {
    console.log("subscribed to posts");
  }
});
serverMqtt.subscribe("getNotifs", (err: Error) => {
  if (!err) {
    console.log("subscribed to notifs");
  }
});
serverMqtt.subscribe("dataNotifs", (err: Error) => {
  if (!err) {
    console.log("subscribed to notifs");
  }
});
serverMqtt.subscribe("deleteNotifs", (err: Error) => {
  if (!err) {
    console.log("subscribed to notifs");
  }
});
const posts = schemas.Posts.aggregate([
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
]).then((postRes: any) => {
  setInterval(() => {
    if (postRes) {
      const randomPost: types.AggregatePostObject =
        postRes[randomInt(postRes.length)];
      const data = { data: randomPost };
      serverMqtt.publish("randomPost", JSON.stringify(data));
    }
  }, 5000);
});

serverMqtt.on("message", async (topic: string, message: string) => {
  try {
    switch (topic) {
      case "postMessages":
        const messageData: types.MQTTMessagePost = JSON.parse(message);
        const token = messageData.token;
        if (!token || !checkTokenValidity(token)) {
          break;
        }
        const decodedToken = jwt.verify(token, secretKey);
        if (typeof decodedToken === "string") {
          break;
        }
        const userId = decodedToken._id;
        const postingUser = await schemas.Users.find({ _id: userId });

        if (!postingUser || userId !== messageData.userId) {
          break;
        }

        const newMessage = new schemas.Messages({
          content: messageData.content,
          author: messageData.author,
          date: messageData.date,
          userId: userId,
          userProfilePicture: messageData.userProfilePicture,
        });

        const saveMessage = await newMessage.save();

        if (!saveMessage) throw new Error();

        serverMqtt.publish("getMessages", "New message");
        break;
      case "getMessages":
        console.log("getmessage rquest");
        const messages = await schemas.Messages.find({}).sort({ date: 1 });
        const data = { data: messages };
        serverMqtt.publish("dataMessages", JSON.stringify(data));
        break;
      case "deleteMessages":
        console.log("delete fireed");
        const deleteData: types.MQTTDeleteMessage = JSON.parse(message);
        const deletingToken = deleteData.token;
        if (!deletingToken || !checkTokenValidity(deletingToken)) {
          break;
        }
        const decodedDeletingToken = jwt.verify(deletingToken, secretKey);
        if (typeof decodedDeletingToken === "string") {
          break;
        }
        const deletingUserId = decodedDeletingToken._id;
        const deletingUser = await schemas.Users.find({ _id: deletingUserId });

        if (
          !deletingUser ||
          (deletingUserId !== deleteData.userId && !checkIfAdmin(deletingUser))
        ) {
          break;
        }

        const deletedMessage = await schemas.Messages.deleteOne({
          _id: deleteData._id,
        });

        const messagesAfter = await schemas.Messages.find({}).sort({ date: 1 });
        serverMqtt.publish("getMessages", "New message");
        break;
      case "getNotifs":
        const notifsId = JSON.parse(message).userId;
        const notifs = await schemas.Notifications.find({
          userId: notifsId,
        });
        const notifsData = { data: notifs };
        serverMqtt.publish("dataNotifs", JSON.stringify(notifsData));
        break;
      case "deleteNotifs":
        console.log("delete fireed");
        const deleteNotifData = JSON.parse(message);
        const deletingNotifToken = deleteNotifData.token;
        if (!deletingNotifToken || !checkTokenValidity(deletingNotifToken)) {
          break;
        }
        const decodedNotifToken = jwt.verify(deletingNotifToken, secretKey);
        if (typeof decodedNotifToken === "string") {
          break;
        }
        const deletingNotifUserId = decodedNotifToken._id;

        const deletingNotifUser = await schemas.Users.find({
          _id: deletingNotifUserId,
        });
        const newId = deletingNotifUser[0]._id.toString();

        if (
          !deletingNotifUser ||
          (deleteNotifData.userId !== newId && !checkIfAdmin(deletingNotifUser))
        ) {
          break;
        }

        const deletedNotif = await schemas.Notifications.deleteOne({
          _id: deleteNotifData.id,
        });

        console.log("before publish");
        serverMqtt.publish(
          "getNotifs",
          JSON.stringify({ userId: deleteNotifData.userId })
        );
        break;
      default:
        break;
    }
  } catch (err: any) {
    console.log(err);
  }
});
