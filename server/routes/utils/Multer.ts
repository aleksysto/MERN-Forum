import { Multer } from "multer";
import { DestinationCallback } from "../../interfaces/MulterTypes";
import { Express, Request } from "express";
const multer = require("multer");

export const storage: Multer = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void {
    cb(null, "../uploads/");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void {
    cb(
      null,
      `${req.params.id}.${file.originalname.split(".").slice(-1).join("")}`
    );
  },
});
export const upload: Multer = multer({ storage });
