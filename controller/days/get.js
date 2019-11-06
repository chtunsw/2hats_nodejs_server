"use strict";
const authorize = require("../../authorize/authorize");
const canlendarTest = require("../../authorize/queryTest");
const { isYearValid, isMonthValid } = require("../../utils/scripts");

module.exports = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const variables = { year, month };
    const missedVariables = Object.keys(variables).filter(key => {
      return variables[key] === undefined;
    });
    if (missedVariables.length !== 0) {
      res.send({
        success: false,
        message: `Request is missing variable: ${missedVariables[0]}`
      });
    } else if (!(isYearValid(year) && isMonthValid(month))) {
      res.send({
        success: false,
        message: `Variable format not valid`
      });
    } else {
      // canlendar auth and test //
      const auth = await authorize(
        `${global.basePath}/authorize/credentials.json`,
        `${global.basePath}/authorize/token.json`
      );
      canlendarTest(auth);
      // canlendar auth and test //
      res.send({ success: true, message: "result" });
    }
  } catch (e) {
    res.send({ success: false, message: "Internal error" });
    next(e);
  }
};
