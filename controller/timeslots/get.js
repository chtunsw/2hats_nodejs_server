"use strict";
const { authorize } = require("../../authorize/authorize");
const { getEventListFromPeriod } = require("../../utils/calendarScripts");
const {
  isYearValid,
  isMonthValid,
  isDayValid,
  getAllSlotsFromDay,
  getAvailableSlots
} = require("../../utils/scripts");

module.exports = async (req, res, next) => {
  try {
    const { year, month, day } = req.query;
    const variables = { year, month, day };
    const missedVariables = Object.keys(variables).filter(key => {
      return variables[key] === undefined;
    });
    if (missedVariables.length !== 0) {
      res.send({
        success: false,
        message: `Request is missing variable: ${missedVariables[0]}`
      });
    } else if (!(isYearValid(year) && isMonthValid(month) && isDayValid(day))) {
      res.send({
        success: false,
        message: `Variable format not valid`
      });
    } else {
      let startTime = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day))
      );
      let endTime = new Date(startTime);
      endTime.setUTCDate(endTime.getUTCDate() + 1);
      const potentialSlots = getAllSlotsFromDay(startTime);
      const auth = await authorize(
        `${global.basePath}/authorize/credentials.json`,
        `${global.basePath}/authorize/token.json`
      );
      const eventList = await getEventListFromPeriod(auth, startTime, endTime);
      const result = getAvailableSlots(potentialSlots, eventList);
      res.send({ success: true, timeSlots: result });
    }
  } catch (e) {
    res.send({ success: false, message: "Internal error" });
    next(e);
  }
};
