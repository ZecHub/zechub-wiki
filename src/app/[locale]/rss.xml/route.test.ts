/** @jest-environment node */
import fs from "fs";
import { GET } from "./route";

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

it("publishes the observation date every time the same snapshot is served", async () => {
  jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify([
    { supply: 4_881_823, close: "11/27/2026" },
  ]));
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-11-28T01:00:00Z"));
  const response = await GET();
  const before = await response.text();
  jest.setSystemTime(new Date("2026-11-28T02:00:00Z"));
  const after = await (await GET()).text();

  const dates = /<pubDate>.*?<\/pubDate>/g;
  const observation = "<pubDate>Fri, 27 Nov 2026 00:00:00 GMT</pubDate>";
  expect(before.match(dates)).toEqual([observation, observation]);
  expect(after.match(dates)).toEqual([observation, observation]);
  expect(after).toContain("shielded-supply-11/27/2026");
  expect(after).toContain("<strong>Date:</strong> 11/27/2026");
  expect(after).not.toContain("<strong>Updated:</strong>");
  expect(response.headers.get("Content-Type")).toMatch(/^application\/rss\+xml/);
});

it("does not publish a fresh observation when the file has no valid sample", async () => {
  jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify([
    { supply: 0, close: "02/30/2026" },
  ]));
  const xml = await (await GET()).text();

  expect(xml).toContain("https://zechub.wiki/dashboard");
  expect(xml).not.toContain("<pubDate>");
  expect(xml).not.toContain("Shielded Supply:");
});
