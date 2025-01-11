import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { unifiedAddress, category } = req.body;

    // Basic validation for Unified Address
    const isValidUnifiedAddress = (address) => {
      return typeof address === "string" && address.length >= 10;
    };

    if (
      !unifiedAddress ||
      !category ||
      !isValidUnifiedAddress(unifiedAddress)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Unified Address or data" });
    }

    // Determine the file path based on the category
    const fileName =
      category === "Ecosystem News"
        ? "ecosystemnews.txt"
        : category === "Network Stats"
        ? "networkstats.txt"
        : null;

    if (!fileName) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const filePath = path.join(
      process.cwd(),
      "public/shieldednewsletter",
      fileName
    );

    const entry = `${unifiedAddress}\n`;

    try {
      fs.appendFileSync(filePath, entry, "utf8");
      return res.status(200).json({ message: "Address saved successfully" });
    } catch (error) {
      console.error("Error writing to file:", error);
      return res.status(500).json({ message: "Error saving address" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
