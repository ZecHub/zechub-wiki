import * as cheerio from "cheerio";
import { appConfig } from "./appConfig";

export interface ZIPData {
  zipNumber: string;
  title: string;
  status: string;
  type?: string;
  authors?: string;
  url: string;
}

export async function fetchZIPs(): Promise<ZIPData[]> {
  try {
    const res = await fetch(appConfig.zipRawUrl);

    if (!res.ok) throw new Error("Failed to fetch ZIPs from GitHub");

    const content = await res.text();

    const startIndex = content.indexOf("Index of ZIPs");
    if (startIndex === -1) {
      throw new Error("Index of ZIPs section not found!");
    }

    const section = content.slice(startIndex);
    const tableMatch = section.match(/<table[\s\S]*?<\/table>/);
    if (!tableMatch) {
      throw new Error("Table not found!");
    }

    const $ = cheerio.load(tableMatch[0]);

    const rows: ZIPData[] = [];

    $("table tr").each((_, row) => {
      const cols = $(row).find("td");

      if (cols.length === 3) {
        rows.push({
          zipNumber: $(cols[0]).text().trim(),
          title: $(cols[1]).text().trim(),
          status: $(cols[2]).text().trim(),
          url: appConfig.zipUrl + $(cols[1]).find("a").attr("href"),
        });
      }
    });

    return rows;
  } catch (e: any) {
    console.error("Failed to fetch ZIPs file");
    throw new Error(e);
  }
}
