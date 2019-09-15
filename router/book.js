"use strict";
const Router = require("express").Router;
const bookPost = require("../controller/book/post");

const router = Router();

router.post("/book", bookPost);

module.exports = router;
