const MINING_HISTORY_ENDPOINT = "https://api.zcashinfo.com/api/v1/mining/history";
const VALID_RANGES = new Set(["24h", "3d", "1w", "1m", "3m", "6m", "1y", "all"]);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const range = typeof req.query.range === "string" ? req.query.range : "24h";

  if (!VALID_RANGES.has(range)) {
    res.status(400).json({ error: "Invalid range parameter" });
    return;
  }

  try {
    const response = await fetch(
      `${MINING_HISTORY_ENDPOINT}?range=${encodeURIComponent(range)}`,
      {
        headers: {
          "User-Agent": "ZecHub-Dashboard",
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching mining history:", error);
    res.status(500).json({ error: "Unable to fetch mining history" });
  }
}
