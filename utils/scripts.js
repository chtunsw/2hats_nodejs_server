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
  let targetMonth = date.getMonth();
  console.log("targetMonth:", targetMonth);
  let dateList = [];
  while (date.getMonth() === targetMonth) {
    dateList.push(new Date(date));
    date.setDate(date.getDate() + 1);
    console.log("date:", date);
  }
  return dateList;
};

console.log(getAllDaysFromMonth(2019, 10));

module.exports = {
  isYearValid,
  isMonthValid,
  isDayValid,
  isHourValid,
  isMinuteValid
};
