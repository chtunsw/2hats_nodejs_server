"use strict";
const {
  isYearValid,
  isMonthValid,
  isDayValid,
  isHourValid,
  isMinuteValid
} = require("../../utils/scripts");

module.exports = async (req, res, next) => {
  try {
    const { year, month, day, hour, minute } = req.query;
    const variables = { year, month, day, hour, minute };
    const missedVariables = Object.keys(variables).filter(key => {
      return variables[key] === undefined;
    });
    if (missedVariables.length !== 0) {
      res.send({
        success: false,
        message: `Request is missing variable: ${missedVariables[0]}`
      });
    } else if (
      !(
        isYearValid(year) &&
        isMonthValid(month) &&
        isDayValid(day) &&
        isHourValid(hour) &&
        isMinuteValid(minute)
      )
    ) {
      res.send({
        success: false,
        message: `Variable format not valid`
      });
    } else {
      res.send({ success: true, message: "result" });
    }
  } catch (e) {
    res.send({ success: false, message: "Internal error" });
    next(e);
  }
};
