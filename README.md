# Booking System

## Instructions

### Get Credentials for Google Calendar API

- Create a Google Cloud Platform (GCP) project with the Google Calendar API enabled
- Go to APIs & Services and create credentials (OAuth client ID).
- Download the client secret .json file from the the client ID you have just created. Then rename it as "credentials.json".

### Get a token

- Clone this project, and in root directory, run:
- npm install
- Put your credentials.json into /authorize directory
- Under /authorize directory, you can get a token by running:
- node getToken.js

### Start the server

- After you get the token, start the server by running:
- npm start

## Booking System API

### GET bookable days

- GET

/days?year=yyyy&month=mm

### GET available time slots

- GET

/timeslots?year=yyyy&month=mm&day=dd

### POST book an appointment

- POST

/book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
