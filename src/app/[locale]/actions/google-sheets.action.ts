"use server";

import { google } from "googleapis";
import { unstable_cache } from "next/cache";
import * as config from "@/config";
import { parseReponseData } from "@/lib/zips/parseReponseData";
import { transformGrantData } from "@/lib/zips/transformGrantData";
import { Grant } from "@/types/grants";

/**
 * Fetches the raw Zcash Community Grants data from Google Sheets upstream.
 * Throws on error so unstable_cache will not cache failed or empty responses.
 */
async function fetchZCGrantsDataFromSheets(): Promise<Grant[]> {
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
}

/**
 * Cached fetch for ZCG Google Sheets data.
 * Revalidates every 3600 seconds (1 hour).
 */
const getCachedZCGrantsData = unstable_cache(
  async () => fetchZCGrantsDataFromSheets(),
  ["zcg-grants-sheets-data"],
  {
    revalidate: 3600,
    tags: ["zcg-grants"],
  }
);

/**
 * Fetches the Zcash Community Grants data
 * from a public Google Sheet using an API key.
 *
 * Cached for 1 hour via unstable_cache:
 * - Drops organic traffic to 1 upstream read/hour.
 * - Replays via Next-Action ID burn cache instead of the 60/min API quota.
 * - Background revalidation failures retain stale data instead of rendering blank tabs.
 */
export async function getZCGrantsData(): Promise<Grant[] | undefined> {
  try {
    return await getCachedZCGrantsData();
  } catch (err) {
    console.error("Failed to fetch Google Sheets data:", err);
    return undefined;
  }
}
