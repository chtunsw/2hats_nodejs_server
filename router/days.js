"use strict";
const Router = require("express").Router;
const getDays = require("../controller/days/get");

const router = Router();

router.get("/days", getDays);

module.exports = router;
