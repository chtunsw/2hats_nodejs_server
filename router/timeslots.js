"use strict";
const Router = require("express").Router;
const getTimeslots = require("../controller/timeslots/get");

const router = Router();

router.get("/timeslots", getTimeslots);

module.exports = router;
