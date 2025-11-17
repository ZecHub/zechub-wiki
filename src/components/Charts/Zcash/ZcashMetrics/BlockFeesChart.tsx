import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CardContentBlockFees = () => {
  const [data, setData] = useState([]);
  const [zecPrice, setZecPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch block fees data
        const feesResponse = await fetch('/data/zcash/blockFeesZEC.json');
        const feesData = await feesResponse.json();
        
        // Fetch current ZEC price (
        try {
          const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd');
          const priceData = await priceResponse.json();
          setZecPrice(priceData.zcash?.usd || null);
        } catch (priceError) {
          console.warn('Could not fetch ZEC price:', priceError);
        }
        
        // Transform data for the chart
        const transformedData = feesData.map((item: { Block: string; Fees: string }) => ({
          block: parseInt(item.Block),
          fees: parseFloat(item.Fees),
          feesUSD: zecPrice ? parseFloat(item.Fees) * zecPrice : null
        }));
        
        setData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching block fees data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border rounded shadow-lg">
          <p className="font-semibold">Block: {payload[0].payload.block.toLocaleString()}</p>
          <p className="text-blue-600">Fees: {payload[0].payload.fees.toFixed(7)} ZEC</p>
          {zecPrice && (
            <p className="text-green-600">≈ ${(payload[0].payload.fees * zecPrice).toFixed(4)} USD</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="h-96 flex items-center justify-center">Loading block fees data...</div>;
  }

  return (
    <div className="p-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="block" 
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            label={{ value: 'Block Height', position: 'insideBottom', offset: -5 }}
          />
          <YAxis label={{ value: 'Fees (ZEC)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="fees" stroke="#8884d8" name="Fees (ZEC)" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      
      {zecPrice && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Current ZEC Price: ${zecPrice.toFixed(2)} USD
        </div>
      )}
    </div>
  );
};

export default CardContentBlockFees;