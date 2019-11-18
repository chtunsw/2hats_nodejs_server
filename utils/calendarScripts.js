"use strict";
const { google } = require("googleapis");

/**
 * Get event list in a period from Google Calender API.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {Date} startTime Start time of period.
 * @param {Date} endTime End time of period.
 */
async function getEventListFromPeriod(auth, startTime, endTime) {
  const calendar = await google.calendar({ version: "v3", auth });
  let eventList = [];
  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date(startTime).toISOString(),
      timeMax: new Date(endTime).toISOString(),
      singleEvents: true,
      orderBy: "startTime"
    });
    const events = res.data.items;
    if (events.length) {
      console.log("events:");
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        const end = event.end.dateTime || event.end.date;
        console.log(event.summary);
        console.log("start:", new Date(start));
        console.log("end:", new Date(end));
        eventList.push({ startTime: new Date(start), endTime: new Date(end) });
      });
    } else {
      console.log("No events found.");
    }
  } catch (e) {
    console.log("The API returned an error: " + e);
  }
  return eventList;
}

/**
 * Create a single event with Google Calender API.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {String} summary Summary of the event.
 * @param {Date} startTime Start time of period.
 * @param {Date} endTime End time of period.
 */
async function createSingleEvent(auth, summary, startTime, endTime) {
  const calendar = await google.calendar({ version: "v3", auth });
  let res;
  try {
    res = await calendar.events.insert({
      calendarId: "primary",
      resource: {
        summary: summary,
        start: { dateTime: new Date(startTime).toISOString() },
        end: { dateTime: new Date(endTime).toISOString() }
      }
    });
  } catch (e) {
    console.log("The API returned an error: " + e);
  }
  return res;
}

module.exports = { getEventListFromPeriod, createSingleEvent };
