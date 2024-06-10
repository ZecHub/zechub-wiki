// pages/api/wallet-likes.js
import { likesData } from "@/lib/wallet-likes";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const likesFilePath = path.join(process.cwd(), "src/lib", "wallet-likes.js");
const ipsFilePath = path.join(process.cwd(), "src/lib", "wallet-likes-proofs.json");

// Function to read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Function to write JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Function to hash text using SHA-1
const hashSHA1 = (text) => {
  return crypto.createHash('sha1').update(text).digest('hex');
};

export default function handler(req, res) {
  if (req.method === "POST") {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Handle localhost IPv6 address
    if (ip === "::1") {
      ip = "127.0.0.1";
    }

    const { title, delta } = req.body;
    const ipTitleKey = `${ip}_${title}`;
    const hashedIpTitleKey = hashSHA1(ipTitleKey);

    const ipsData = readJsonFile(ipsFilePath);

    if (ipsData[hashedIpTitleKey]) {
      return res.status(429).json({ message: "You have already updated likes for this title." });
    }

    if (!likesData[title]) {
      likesData[title] = 0;
    }

    likesData[title] += delta;

    // Update the IP data
    ipsData[hashedIpTitleKey] = true;

    // Write the updated likesData and ipsData to their respective files
    const likesFileContent = `const likesData = ${JSON.stringify(likesData, null, 2)};\n\nmodule.exports = { likesData };`;

    fs.writeFile(likesFilePath, likesFileContent, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return res.status(500).json({ message: "Failed to update likes" });
      }

      writeJsonFile(ipsFilePath, ipsData);

      res.status(200).json({ message: "Like updated successfully", likes: likesData[title] });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
