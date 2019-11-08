"use strict";
const { authorize } = require("../../authorize/authorize");
const { getEventListFromPeriod } = require("../../utils/calendarScripts");
const {
  getAllDaysFromMonth,
  getAllSlotsFromDay,
  getAvailableSlots
} = require("../../utils/scripts");
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
      const dateList = getAllDaysFromMonth(Number(year), Number(month));
      const dateIndexList = dateList.reduce(
        (accumulator, currentValue) =>
          accumulator.concat(currentValue.getUTCDate()),
        []
      );
      const potentialSlots = dateList.reduce(
        (accumulator, currentValue) =>
          accumulator.concat(getAllSlotsFromDay(currentValue)),
        []
      );
      const startTime = new Date(dateList[0]);
      const endTime = new Date(dateList[dateList.length - 1]);
      endTime.setUTCDate(endTime.getUTCDate() + 1);
      const auth = await authorize(
        `${global.basePath}/authorize/credentials.json`,
        `${global.basePath}/authorize/token.json`
      );
      const eventList = await getEventListFromPeriod(auth, startTime, endTime);
      const availableSlots = getAvailableSlots(potentialSlots, eventList);
      const availableDateIndexList = availableSlots
        .map(slot => slot.startTime.getUTCDate())
        .filter((value, index, array) => array.indexOf(value) === index);
      const result = dateIndexList.map(dateIndex => {
        if (availableDateIndexList.includes(dateIndex)) {
          return { day: dateIndex, hasTimeSlots: true };
        } else {
          return { day: dateIndex, hasTimeSlots: false };
        }
      });
      res.send({ success: true, days: result });
    }
  } catch (e) {
    res.send({ success: false, message: "Internal error" });
    next(e);
  }
};
