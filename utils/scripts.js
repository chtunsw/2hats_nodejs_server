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
  } else if (Number(hour) < 0 || Number(hour) > 24) {
    return false;
  }
  return true;
};

const isMinuteValid = minute => {
  if (minute.length !== 2) {
    return false;
  } else if (isNaN(minute)) {
    return false;
  } else if (Number(minute) < 0 || Number(minute) > 60) {
    return false;
  }
  return true;
};

module.exports = {
  isYearValid,
  isMonthValid,
  isDayValid,
  isHourValid,
  isMinuteValid
};
