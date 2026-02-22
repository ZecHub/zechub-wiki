"use server";

import { google } from "googleapis";
import * as config from "../../config";
import { transformGrantData } from "../governance/lib/transformGrantData";

/**
 * This function fetches the Zcash Community Grants data
 * from google sheet where it's made public
 * @returns any[] {any}
 */
export async function getZCGrantsData() {
  const auth = new google.auth.JWT({
    email: config.GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key:  config.GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: [config.GOOGLE_ZCG_SPREADSHEET_SCOPE],
  });

  try {
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.GOOGLE_ZCG_SPREADSHEET_ID,
      range: config.GOOGLE_ZCG_SHEET_RANGE,
    });

    const resp = response.data.values || [];

    const data = parseReponseData(resp);
    const transformed = transformGrantData(data);

    return transformed;
  } catch (err) {
    console.error(err);
  }
}

function parseReponseData(data: string[][]) {
  const labelArr = data.slice(0, 1)[0].map((l) => l.replace(/\n/g, ""));

  const arrObj: any[] = [];

  data.slice(1, data.length).forEach((arr) => {
    const obj: Record<string, any> = {};

    arr.forEach((a, i) => {
      const key = labelArr[i];
      obj[key] = a;
    });

    arrObj.push(obj);
  });

  return arrObj;
}
