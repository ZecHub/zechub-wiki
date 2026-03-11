"use server";

import { google } from "googleapis";
import * as config from "../../config";
import { parseReponseData } from "../zips-grants/lib/parseReponseData";
import { transformGrantData } from "../zips-grants/lib/transformGrantData";

/**
 * This function fetches the Zcash Community Grants data
 * from google sheet where it's made public
 * @returns Promise<Grant[] | undefined>
 */
export async function getZCGrantsData() {
  const auth = new google.auth.JWT({
    email: config.GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: config.GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_PRIVATE_KEY!.replace(
      /\\n/g,
      "\n",
    ),
    scopes: [config.GOOGLE_ZCG_SPREADSHEET_SCOPE],
  });

  try {
    const sheets = google.sheets({ version: "v4", auth });

    const resWithLink = await sheets.spreadsheets.get({
      auth,
      spreadsheetId: String(config.GOOGLE_ZCG_SPREADSHEET_ID),
      ranges: [String(config.GOOGLE_ZCG_SHEET_RANGE)],
      fields:
        "sheets(data(rowData(values(userEnteredValue,effectiveValue,formattedValue,hyperlink))))",
    });

    const sheetData = resWithLink?.data?.sheets?.[0]?.data?.[0]?.rowData ?? [];

    const result = sheetData!.map((row) => {
      return (
        row.values?.map((cell) => {
          const url = cell.hyperlink;

          const text =
            cell.formattedValue ??
            cell.effectiveValue?.stringValue ??
            cell.effectiveValue?.numberValue ??
            null;

          if (url && text) {
            return `${text}::${url}`;
          }

          return text;
        }) || []
      );
    }) as string[][];

    const parsedData = parseReponseData(result);
    const transformed = transformGrantData(parsedData);

    return transformed;
  } catch (err) {
    console.error(err);
  }
}
