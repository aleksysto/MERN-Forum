// const schemas = require("../models/schemas");
// import * as types from "../interfaces/RouterTypes";
// import { InferSchemaType } from "mongoose";
// import { storage, upload } from "./utils/Multer";
// import path from "path";
// import searchAggregation from "./utils/SearchAggregation";
// import {
//   checkIfAdmin,
//   checkIfCorrectId,
//   checkTokenValidity,
//   secretKey,
// } from "./utils/ValidityCheck";
// const multer = require("multer");
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { ReportObject } from "../interfaces/ModelTypes";
// const router = require("express").Router();
// const sseChannel = require("sse-channel");
// const randomChannel = new sseChannel();

// router.get("/event/randomPost", (req: any, res: any) => {
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders(); // flush the headers to establish SSE with client

//   let counter = 0;
//   let interValID = setInterval(() => {
//     counter++;
//     if (counter >= 10) {
//       clearInterval(interValID);
//       res.end(); // terminates SSE session
//       return;
//     }
//     res.write(`data: "mefedronPost"`); // res.write() instead of res.send()
//   }, 1000);

//   // If client closes connection, stop sending events
//   res.on("close", () => {
//     console.log("client dropped me");
//     clearInterval(interValID);
//     res.end();
//   });
// });

// const posts = schemas.Posts.find();

// // setInterval(() => {
// //   const randomPost: types.AggregatePostObject = posts[randomInt(posts.length)];
// //   randomChannel.send({ msg: "123" });
// // }, 1000);

// module.exports = router;
