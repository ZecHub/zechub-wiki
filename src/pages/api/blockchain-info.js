// pages/api/blockchain-info.js

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const response = await fetch('https://explorer.zec.rocks/api/v1/blockchain-info');
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching blockchain info:', error);
            res.status(500).json({ error: 'Unable to fetch blockchain info' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
