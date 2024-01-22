import { FileFilterCallback, Multer } from "multer";
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

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const upload: Multer = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2097152 },
});
// 2097152 2 megabytes
