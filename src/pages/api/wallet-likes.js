// pages/api/wallet-likes.js
import { Client } from 'pg';
import crypto from 'crypto';

const dailyLimit4WalletVotes = 5;

// Function to hash text using SHA-1
const hashSHA1 = (text) => {
  return crypto.createHash('sha1').update(text).digest('hex');
};

export default async function handler(req, res) {
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

    const ipTitleKey = `${ip}_${title}`;
    const hashedIpTitleKey = hashSHA1(ipTitleKey);

    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
    });

    await client.connect();

    try {
      if (delta === 0) {
        const resLikes = await client.query('SELECT title, likes FROM wallet_likes');
        const likesData = resLikes.rows.reduce((acc, row) => {
          acc[row.title] = row.likes;
          return acc;
        }, {});
        return res.status(200).json(likesData);
      } else {
        const today = new Date().toISOString().split('T')[0];

        // Check if the user has already voted for this title today
        const resIp = await client.query('SELECT EXISTS (SELECT 1 FROM wallet_likes_proofs WHERE hash = $1)', [hashedIpTitleKey]);

        if (resIp.rows[0].exists) {
          return res.status(429).json({ message: "You reviewed this in the past." });
        }

        await client.query('BEGIN');

        // Check the vote limit
        const resLimit = await client.query('SELECT votes FROM wallet_likes_limits WHERE title = $1 AND day = $2', [title, today]);

        let currentVotes = 0;
        if (resLimit.rows.length > 0) {
          currentVotes = resLimit.rows[0].votes;
        }

        if (currentVotes >= dailyLimit4WalletVotes) {
          await client.query('ROLLBACK');
          return res.status(429).json({ message: "" });
        }

        // Update the votes limit table
        if (resLimit.rows.length === 0) {
          await client.query('INSERT INTO wallet_likes_limits (title, day, votes) VALUES ($1, $2, $3)', [title, today, 1]);
        } else {
          await client.query('UPDATE wallet_likes_limits SET votes = votes + 1 WHERE title = $1 AND day = $2', [title, today]);
        }

        // Update the likes count
        const resLikes = await client.query('SELECT likes FROM wallet_likes WHERE title = $1', [title]);
        let newLikes;
        
        if (delta > 0)
          newLikes = 1;
        else
          newLikes = -1;

        if (resLikes.rows.length === 0) {
          await client.query('INSERT INTO wallet_likes (title, likes) VALUES ($1, $2)', [title, newLikes]);
        } else {
          newLikes = resLikes.rows[0].likes + newLikes;
          await client.query('UPDATE wallet_likes SET likes = $1 WHERE title = $2', [newLikes, title]);
        }

        await client.query('INSERT INTO wallet_likes_proofs (hash) VALUES ($1)', [hashedIpTitleKey]);

        await client.query('COMMIT');

        return res.status(200).json({ message: "Like updated successfully", likes: newLikes });
      }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating likes:', error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      await client.end();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

