import { Router } from "express";
const express = require("express");
const user = require("./user");
const post = require("./post");
const comment = require("./comment");

const router: Router = express.Router();
router.use(user);
router.use(post);
router.use(comment);

module.exports = router;
