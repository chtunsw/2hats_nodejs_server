"use strict";
const createOAuth = require("./authorize");
const { google } = require("googleapis");

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function canlendarTest(auth) {
  const calendar = await google.calendar({ version: "v3", auth });
  try {
    const res = await calendar.calendarList.list({});
    const calendars = res.data.items;
    if (calendars.length) {
      console.log("calendar list:");
      calendars.map((calendar, i) => {
        console.log(calendar);
      });
    } else {
      console.log("No canlendar found.");
    }
  } catch (e) {
    console.log("The API returned an error: " + e);
  }
  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
    });
    const events = res.data.items;
    if (events.length) {
      console.log("Upcoming 10 events:");
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log("No upcoming events found.");
    }
  } catch (e) {
    console.log("The API returned an error: " + e);
  }
}

// get auth and run listEvent
(async () => {
  const auth = await createOAuth();
  console.log("auth res:", auth);
  canlendarTest(auth);
})();
