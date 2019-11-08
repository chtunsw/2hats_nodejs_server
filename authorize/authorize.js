"use strict";
const fs = require("fs");
const util = require("util");
const readline = require("readline");
const { google } = require("googleapis");

// Convert fs.readFile into Promise version of same
const promisifiedReadFile = util.promisify(fs.readFile);
const promisifiedWriteFile = util.promisify(fs.writeFile);

/**
 * @param {String} CREDENTIAL_PATH path of credentials.json
 * @param {String} TOKEN_PATH path of token.json
 */
async function authorize(CREDENTIAL_PATH, TOKEN_PATH) {
  const fileContent = await promisifiedReadFile(CREDENTIAL_PATH);
  const credentials = JSON.parse(fileContent);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  // Check if we have previously stored a token.
  try {
    const token = await promisifiedReadFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token).tokens);
  } catch (e) {
    console.log("need a new token:");
    return await getAccessToken(oAuth2Client);
  }

  return oAuth2Client;
}

/**
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getAccessToken(oAuth2Client) {
  const authUrl = await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"]
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const authPromise = new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", async code => {
      rl.close();
      try {
        const token = await oAuth2Client.getToken(code);
        try {
          await oAuth2Client.setCredentials(token.tokens);
          await promisifiedWriteFile(TOKEN_PATH, JSON.stringify(token));
          console.log("Token stored to", TOKEN_PATH);
          resolve(oAuth2Client);
        } catch (e) {
          console.log(e);
          reject("e");
        }
      } catch (e) {
        console.log("Error retrieving access token", e);
        reject("e");
      }
    });
  });
  return authPromise;
}

module.exports = { authorize };
