"use strict";
const { authorize } = require("./authorize");

(async () => {
  await authorize("credentials.json", "token.json");
})();
