"use strict";
const express = require("express");
const router = require("./router");

// set global base path
global.basePath = __dirname;

const app = express();

// parse json payloads in req
app.use(express.json());

// set cors header
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*"
  });
  next();
});

app.use(router);

app.listen(2000, () => {
  console.log("server starts at port: 2000");
});
