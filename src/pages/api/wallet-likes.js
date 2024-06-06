// pages/api/wallet-likes.js
import { likesData } from "@/lib/wallet-likes";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/lib", "wallet-likes.js");

export default function handler(req, res) {
  console.log(filePath);
  if (req.method === "POST") {
    const { title } = req.body;

    if (!likesData[title]) {
      likesData[title] = 0;
    }

    likesData[title] += 1;

    // Write the updated likesData to the file
    const fileContent = `const likesData = ${JSON.stringify(likesData, null, 2)};\n\nmodule.exports = { likesData };`;

    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return res.status(500).json({ message: "Failed to update likes" });
      }

      res.status(200).json({ message: "Like updated successfully", likes: likesData[title] });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
