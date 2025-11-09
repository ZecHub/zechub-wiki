'use client';
import { useEffect, useState } from 'react';

const api = ['https://api.blockchair.com/zcash/stats'];

function fetchData(url:any) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(`API request error: ${xhr.status} ${xhr.statusText}`));
      }
    };
    xhr.onerror = function () {
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

export const HalvingMeter = () => {
  const [halvingDate, setHalvingDate] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [blocksToHalving, setBlocksToHalving] = useState(0);
  const [countDownDate, setCountDownDate] = useState(0);
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [loading, setLoading] = useState(true);

  const previousHalvingBlock = 2092800; 
  const nextHalvingBlock = 4406400;

  // Halving progress data
  const progressPercent = currentBlock > 0 ? (currentBlock / nextHalvingBlock) * 100 : 0;

  // Fetch data once on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const apiData = await Promise.all(api.map((url) => fetchData(url)));
        const z_stats:any = apiData[0];
        const blocks = z_stats.data.blocks;
        const remaining = nextHalvingBlock - blocks;
        
        setCurrentBlock(blocks);
        setBlocksToHalving(remaining);
        
        const secsToHalving = remaining * 75;
        const cntDownDate = new Date().getTime() + secsToHalving * 1000;
        
        setCountDownDate(cntDownDate);
        setHalvingDate(cntDownDate);
        setLoading(false);
      } catch (err) {
        console.log('An error occurred:', err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array - only run once

  // Separate effect for the countdown timer
  useEffect(() => {
    if (!countDownDate || countDownDate === 0) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        setDays('00');
        setHours('00');
        setMinutes('00');
        setSeconds('00');
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, '0');
      setDays(d);

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        .toString()
        .padStart(2, '0');
      setHours(h);

      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, '0');
      setMinutes(m);

      const s = Math.floor((distance % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, '0');
      setSeconds(s);
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [countDownDate]);

  if (loading) {
    return (
      <div className='flex flex-col my-8 space-y-4 border-2 border-blue-200 p-4'>
        <h2 className='font-bold'>Halving Meter</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className='flex flex-col my-8 space-y-4 border-2 border-blue-200 p-4'
      id='halving-meter'
    >
      <h2 className='font-bold'>Halving Meter</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='shadow-lg p-4 rounded-md'>
          <h2 className='font-bold capitalize text-lg text-blue-500 py-2'>
            Halving Date
          </h2>
          <div className='pt-2'>
            <div>
              <span>{new Date(halvingDate).toDateString()}</span>
            </div>
          </div>
        </div>
        <div className='shadow-lg p-4 rounded-md'>
          <h2 className='font-bold capitalize text-lg text-blue-500 py-2'>
            Blocks Until Halving
          </h2>
          <div className='pt-2'>
            <div>
              <span>{blocksToHalving.toLocaleString('en-US')}</span>
            </div>
          </div>
        </div>
      </div>
      <div id='halving-bar' className='flex flex-col space-y-4'>
        <h1 className='font-bold mt-8'>Halving Progress (%)</h1>
        <div className='relative w-full h-12 bg-gray-200 rounded-lg overflow-hidden'>
          <div
            className='absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300'
            style={{ width: `${progressPercent.toFixed(2)}%` }}
          ></div>
          <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-gray-800 z-10'>
            {progressPercent.toFixed(2) + '%'}
          </span>
        </div>
        <h2 className='flex justify-center text-xl font-bold'>
          {`${days}d ${hours}h ${minutes}m ${seconds}s to go!`}
        </h2>
      </div>
    </div>
  );
};