"use strict";
const fs = require("fs");
const util = require("util");
const readline = require("readline");
const { google } = require("googleapis");

// Convert fs.readFile into Promise version of same
const promisifiedReadFile = util.promisify(fs.readFile);
const promisifiedWriteFile = util.promisify(fs.writeFile);

const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  // Check if we have previously stored a token.
  try {
    const token = await promisifiedReadFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
  } catch (e) {
    return getAccessToken(oAuth2Client);
  }

  return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client) {
  const authUrl = await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"]
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", async code => {
    rl.close();
    // old approach
    // oAuth2Client.getToken(code, (err, token) => {
    //   if (err) return console.error("Error retrieving access token", err);
    //   oAuth2Client.setCredentials(token);
    //   // Store the token to disk for later program executions
    //   fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
    //     if (err) return console.error(err);
    //     console.log("Token stored to", TOKEN_PATH);
    //   });
    // });

    // new approach
    try {
      const token = await oAuth2Client.getToken(code);
      try {
        await oAuth2Client.setCredentials(token);
        await promisifiedWriteFile(TOKEN_PATH, JSON.stringify(token));
        console.log("Token stored to", TOKEN_PATH);
      } catch (e) {
        return console.error(err);
      }
    } catch (e) {
      return console.error("Error retrieving access token", err);
    }
  });
  return oAuth2Client;
}

// create and return oAuth client
module.exports = async function createOAuth() {
  try {
    const content = await promisifiedReadFile("credentials.json");
    const auth = await authorize(JSON.parse(content));
    return auth;
  } catch (e) {
    console.log(e);
  }
};
