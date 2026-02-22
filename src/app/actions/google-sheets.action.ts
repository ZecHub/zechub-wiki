"use server";

import { google } from "googleapis";
import keys from "../../../zcg-service-account_teak-surge-466414-v7-f4aa089dbb8d.json";
import * as config from "../../config";

/**
 * This function fetches the Zcash Community Grants data
 * from google sheet where it's made public
 * @returns any[] {any}
 */
export async function getZCGrantsData() {
  const auth = new google.auth.JWT({
    email: config.GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL, // keys.client_email,
    key: keys.private_key.replace(/\\n/g, "\n"),
    scopes: [config.GOOGLE_ZCG_SPREADSHEET_SCOPE],
  });

  try {
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.GOOGLE_ZCG_SPREADSHEET_ID,
      range: config.GOOGLE_ZCG_SHEET_RANGE,
    });

    const resp = response.data.values || [];

  return resp;
  } catch (err) {
    console.error(err);
  }
}
