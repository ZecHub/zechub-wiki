"use server";

import { google } from "googleapis";
import * as config from "../../config";
import { parseReponseData } from "@/lib/zips/parseReponseData";
import { transformGrantData } from "@/lib/zips/transformGrantData";

/**
 * Fetches the Zcash Community Grants data
 * from a public Google Sheet using an API key.
 */
export async function getZCGrantsData() {
  try {
    const sheets = google.sheets({
      version: "v4",
      auth: config.GOOGLE_API_KEY,
    });

    const resWithLink = await sheets.spreadsheets.get({
      spreadsheetId: String(config.GOOGLE_ZCG_SPREADSHEET_ID),
      ranges: [String(config.GOOGLE_ZCG_SHEET_RANGE)],
      fields:
        "sheets(data(rowData(values(userEnteredValue,effectiveValue,formattedValue,hyperlink))))",
    });

    const sheetData = resWithLink?.data?.sheets?.[0]?.data?.[0]?.rowData ?? [];

    const result = sheetData.map((row) => {
      return (
        row.values?.map((cell) => {
          const url = cell.hyperlink;

          const text =
            cell.formattedValue ??
            cell.effectiveValue?.stringValue ??
            cell.effectiveValue?.numberValue?.toString() ??
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
    console.error("Failed to fetch Google Sheets data:", err);
    return undefined;
  }
}
