"use strict";
const { authorize } = require("../../authorize/authorize");
const {
  getEventListFromPeriod,
  createSingleEvent
} = require("../../utils/calendarScripts");
const {
  isYearValid,
  isMonthValid,
  isDayValid,
  isHourValid,
  isMinuteValid,
  getAllSlotsFromDay,
  getAvailableSlots
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
      let targetSlotStartTime = new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(minute)
        )
      );
      let targetSlotEndTime = new Date(targetSlotStartTime);
      targetSlotEndTime.setUTCMinutes(targetSlotEndTime.getUTCMinutes() + 40);
      let appointmentTime = new Date(targetSlotStartTime);
      appointmentTime.setUTCDate(appointmentTime.getUTCDate() - 1);
      let currentTime = new Date(new Date().toUTCString());
      if (currentTime.getTime() > appointmentTime.getTime()) {
        res.send({
          success: false,
          message: "Bookings can only be made at least 24 hours in advance"
        });
      } else {
        let startDate = new Date(
          Date.UTC(Number(year), Number(month) - 1, Number(day))
        );
        let endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        let potentialSlots = getAllSlotsFromDay(startDate);
        let auth = await authorize(
          `${global.basePath}/authorize/credentials.json`,
          `${global.basePath}/authorize/token.json`
        );
        let eventList = await getEventListFromPeriod(auth, startDate, endDate);
        let availableSlots = getAvailableSlots(potentialSlots, eventList);
        if (
          availableSlots.some(
            slot => slot.startTime.getTime() === targetSlotStartTime.getTime()
          )
        ) {
          const result = await createSingleEvent(
            auth,
            "massage",
            targetSlotStartTime,
            targetSlotEndTime
          );
          res.send({
            success: true,
            startTime: targetSlotStartTime,
            endTime: targetSlotEndTime
          });
        } else {
          res.send({ success: false, message: "Invalid time slot" });
        }
      }
    }
  } catch (e) {
    res.send({ success: false, message: "Internal error" });
    next(e);
  }
};
