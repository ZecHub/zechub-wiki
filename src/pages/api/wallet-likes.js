// pages/api/wallet-likes.js
import fs from "fs";
import path from "path";
import crypto from "crypto";

const likesFilePath = path.join(process.cwd(), "public", "wallet-likes.json");
const ipsFilePath = path.join(process.cwd(), "public", "wallet-likes-proofs.json");

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
    const { title, delta } = req.body;
    if (typeof title !== 'string' || typeof delta !== 'number') {
      return res.status(400).json({ message: "Invalid request body" });
    }

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Handle localhost IPv6 address
    if (ip === "::1") {
      ip = "127.0.0.1";
    }

    const likesData = readJsonFile(likesFilePath);
    const ipsData = readJsonFile(ipsFilePath);

    if (delta === 0) {
      return res.status(200).json(likesData);
    } else {
      const ipTitleKey = `${ip}_${title}`;
      const hashedIpTitleKey = hashSHA1(ipTitleKey);

      if (ipsData[hashedIpTitleKey]) {
        return res.status(429).json({ message: "You have already updated likes for this title." });
      }

      if (!likesData[title]) {
        likesData[title] = 0;
      }

      likesData[title] += delta;

      // Update the IP data
      ipsData[hashedIpTitleKey] = true;

      writeJsonFile(likesFilePath, likesData);
      writeJsonFile(ipsFilePath, ipsData);
      return res.status(200).json({ message: "Like updated successfully", likes: likesData[title] });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
