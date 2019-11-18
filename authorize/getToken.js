"use strict";
const { authorize } = require("./authorize");

// Get a new token for first time authorization.
(async () => {
  await authorize("credentials.json", "token.json");
})();
