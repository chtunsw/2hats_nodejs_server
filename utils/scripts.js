"use strict";

const isYearValid = year => {
  if (year.length !== 4) {
    return false;
  } else if (isNaN(year)) {
    return false;
  } else if (Number(year) < 2019) {
    return false;
  }
  return true;
};

const isMonthValid = month => {
  if (month.length !== 2) {
    return false;
  } else if (isNaN(month)) {
    return false;
  } else if (Number(month) < 1 || Number(month) > 12) {
    return false;
  }
  return true;
};

const isDayValid = day => {
  if (day.length !== 2) {
    return false;
  } else if (isNaN(day)) {
    return false;
  } else if (Number(day) < 1 || Number(day) > 31) {
    return false;
  }
  return true;
};

const isHourValid = hour => {
  if (hour.length !== 2) {
    return false;
  } else if (isNaN(hour)) {
    return false;
  } else if (Number(hour) < 0 || Number(hour) > 23) {
    return false;
  }
  return true;
};

const isMinuteValid = minute => {
  if (minute.length !== 2) {
    return false;
  } else if (isNaN(minute)) {
    return false;
  } else if (Number(minute) < 0 || Number(minute) > 59) {
    return false;
  }
  return true;
};

const getAllDaysFromMonth = (year, month) => {
  let date = new Date(Date.UTC(year, month - 1));
  let targetMonth = date.getUTCMonth();
  let dateList = [];
  while (date.getUTCMonth() === targetMonth) {
    dateList.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return dateList;
};

const getAllSlotsFromDay = date => {
  let dateCopy = new Date(date);
  let slotList = [];
  if (dateCopy.getUTCDay() === 0 || dateCopy.getUTCDay() === 6) {
  } else {
    dateCopy.setUTCHours(9);
    let currentSlotEndTime = new Date(dateCopy);
    currentSlotEndTime.setUTCMinutes(currentSlotEndTime.getUTCMinutes() + 40);
    while (currentSlotEndTime.getUTCHours() < 18) {
      let tempDay = new Date(dateCopy);
      let slot = {
        startTime: new Date(tempDay),
        endTime: new Date(tempDay.setUTCMinutes(tempDay.getUTCMinutes() + 40))
      };
      slotList.push(slot);
      dateCopy.setUTCMinutes(dateCopy.getUTCMinutes() + 45);
      currentSlotEndTime = new Date(dateCopy);
      currentSlotEndTime.setUTCMinutes(currentSlotEndTime.getUTCMinutes() + 40);
    }
  }
  return slotList;
};

const getAvailableSlots = (potentialSlots, busySlots) => {
  let availableSlots = [...potentialSlots];
  let badSlots = [];
  let potentialIndex = 0;
  let busyIndex = 0;
  // traverse both array
  while (
    potentialIndex <= potentialSlots.length - 1 &&
    busyIndex <= busySlots.length - 1
  ) {
    // if potential slot starts before busy slot ends
    if (
      potentialSlots[potentialIndex].startTime.getTime() <
      busySlots[busyIndex].endTime.getTime()
    ) {
      // if potential slot ends after busy slot starts
      if (
        potentialSlots[potentialIndex].endTime.getTime() >
        busySlots[busyIndex].startTime.getTime()
      ) {
        if (!badSlots.includes(potentialSlots[potentialIndex])) {
          badSlots.push(potentialSlots[potentialIndex]);
          availableSlots.splice(
            availableSlots.indexOf(potentialSlots[potentialIndex]),
            1
          );
        }
      }
      if (potentialIndex < potentialSlots.length - 1) {
        potentialIndex += 1;
      } else if (busyIndex < busySlots.length - 1) {
        busyIndex += 1;
      } else {
        break;
      }
    } else {
      if (busyIndex < busySlots.length - 1) {
        busyIndex += 1;
      } else if (potentialIndex < potentialSlots.length - 1) {
        potentialIndex += 1;
      } else {
        break;
      }
    }
  }
  return availableSlots;
};

module.exports = {
  isYearValid,
  isMonthValid,
  isDayValid,
  isHourValid,
  isMinuteValid,
  getAllDaysFromMonth,
  getAllSlotsFromDay,
  getAvailableSlots
};
