'use client';
import { useEffect, useState } from 'react';

const api = ['https://api.blockchair.com/zcash/stats'];

function fetchData(url: any) {
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

  const previousHalvingBlock = 2726400; // Block 2726400 (Nov 28, 2024)
  const nextHalvingBlock = 4406400;     // Block 4406400 (estimated Nov 28, 2028)

  // Fetch data once on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const apiData = await Promise.all(api.map((url) => fetchData(url)));
        const z_stats: any = apiData[0];
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

  // Halving progress data - calculated from previous halving block
  const progressPercent = currentBlock > 0 ? 
    ((currentBlock - previousHalvingBlock) / (nextHalvingBlock - previousHalvingBlock)) * 100 : 0;

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
      className='flex flex-col my-8 space-y-4 p-4'
      id='halving-meter'
    >
      <h2 className='font-bold'>Halving Meter</h2>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='shadow-lg p-4 rounded-md'>
          <h2 className='font-bold capitalize text-lg text-blue-500 py-2'>
            Current Block
          </h2>
          <div className='pt-2'>
            <div>
              <span>{currentBlock.toLocaleString('en-US')}</span>
            </div>
          </div>
        </div>
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
            style={{ width: `${Math.min(progressPercent, 100).toFixed(2)}%` }}
          ></div>
          <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-gray-800 z-10'>
            {Math.min(progressPercent, 100).toFixed(2) + '%'}
          </span>
        </div>
        <h2 className='flex justify-center text-xl font-bold'>
          {`${days}d ${hours}h ${minutes}m ${seconds}s to go!`}
        </h2>
      </div>
      
      {/* Highlighted Information Box */}
      <div className='bg-yellow-50 dark:bg-gray-800 border border-yellow-200 rounded-lg p-4 mt-4'>
        <p className='text-sm dark:text-white text-yellow-800 font-medium'>
          Zcash issuance schedule may change
        </p>
        <p className='text-sm dark:text-white text-yellow-700 mt-2'>
          The Network Sustainability Mechanism is a draft set of features planned for Network Upgrade 7 (NU7). If implemented the Block Subsidy schedule will be smoothed.
        </p>
        <div className='text-sm dark:text-white text-yellow-700 mt-2'>
          <p className='font-medium'>Learn More:</p>
          <a 
            href='https://zips.z.cash/zip-0234' 
            target='_blank' 
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 underline'
          >
            https://zips.z.cash/zip-0234
          </a>
          <br />
          <a 
            href='https://shieldedlabs.net/nsm/' 
            target='_blank' 
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 underline'
          >
            https://shieldedlabs.net/nsm/
          </a>
        </div>
      </div>

      <div className='text-sm dark:text-gray-300 text-gray-600 mt-2'>
        <p>Progress from Block {previousHalvingBlock.toLocaleString()} (Previous Halving - 2024) to Block {nextHalvingBlock.toLocaleString()} (Next Halving - 2028)</p>
      </div>
    </div>
  );
};