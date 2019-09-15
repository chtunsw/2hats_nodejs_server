"use strict";
const Router = require("express").Router;
const bookRouter = require("./book");
const daysRouter = require("./days");
const timeslotsRouter = require("./timeslots");
const router = Router();

router.use(bookRouter);
router.use(daysRouter);
router.use(timeslotsRouter);

module.exports = router;
