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
  const [isVisible, setIsVisible] = useState(false);

  const previousHalvingBlock = 2092800;
  const previousHalvingDate = new Date('2024-11-28').getTime(); // November 28, 2024
  const nextHalvingBlock = 4406400;

  // Halving progress data
  const progressPercent = currentBlock > 0 ? (currentBlock / nextHalvingBlock) * 100 : 0;

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

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Button in Chart Options Bar */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={toggleVisibility}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          {isVisible ? 'Hide Halving Meter' : 'Show Halving Meter'}
        </button>
      </div>

      {/* Halving Meter Section */}
      {isVisible && (
        <div
          className="flex flex-col my-8 space-y-4 border-2 border-blue-200 p-4 rounded-lg bg-white shadow-md"
          id="halving-meter"
        >
          <h2 className="font-bold text-2xl text-gray-800">Halving Meter</h2>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="shadow-lg p-4 rounded-md bg-gray-50">
                  <h2 className="font-bold capitalize text-lg text-blue-500 py-2">
                    Previous Halving Date
                  </h2>
                  <div className="pt-2">
                    <div>
                      <span className="text-gray-700">
                        {new Date(previousHalvingDate).toDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shadow-lg p-4 rounded-md bg-gray-50">
                  <h2 className="font-bold capitalize text-lg text-blue-500 py-2">
                    Next Halving Date
                  </h2>
                  <div className="pt-2">
                    <div>
                      <span className="text-gray-700">
                        {new Date(halvingDate).toDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shadow-lg p-4 rounded-md bg-gray-50">
                  <h2 className="font-bold capitalize text-lg text-blue-500 py-2">
                    Current Block
                  </h2>
                  <div className="pt-2">
                    <div>
                      <span className="text-gray-700">
                        {currentBlock.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shadow-lg p-4 rounded-md bg-gray-50">
                  <h2 className="font-bold capitalize text-lg text-blue-500 py-2">
                    Blocks Until Halving
                  </h2>
                  <div className="pt-2">
                    <div>
                      <span className="text-gray-700">
                        {blocksToHalving.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div id="halving-bar" className="flex flex-col space-y-4 mt-6">
                <h1 className="font-bold text-xl text-gray-800">Halving Progress (%)</h1>
                <div className="relative w-full h-12 bg-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progressPercent.toFixed(2)}%` }}
                  ></div>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-gray-800 z-10">
                    {progressPercent.toFixed(2) + '%'}
                  </span>
                </div>
                <h2 className="flex justify-center text-xl font-bold text-gray-800">
                  {`${days}d ${hours}h ${minutes}m ${seconds}s to go!`}
                </h2>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};