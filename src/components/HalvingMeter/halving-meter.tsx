// src/components/HalvingMeter/halving-meter.tsx
"use client";

import { useEffect, useState } from 'react';
import './halving-meter.css';

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
  const [halvingDate, setHalvingDate]         = useState(0);
  const [currentBlock, setCurrentBlock]       = useState(0);
  const [blocksToHalving, setBlocksToHalving] = useState(0);
  const [countDownDate, setCountDownDate]     = useState(0);

  const [days, setDays]       = useState('');
  const [hours, setHours]     = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const previousHalvingBlock = 1046400;
  const nextHalvingBlock     = 2726400;

  // Halving progress data
  const totalBlocks     = nextHalvingBlock - previousHalvingBlock;
  const completedBlocks = currentBlock - previousHalvingBlock;
  const progressPercent = (completedBlocks / totalBlocks) * 100;

  // ─── FETCH + START TIMER ───────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const apiData: any[] = await Promise.all(api.map((url) => fetchData(url)));
        const z_stats: any   = apiData[0];

        setCurrentBlock(z_stats.data.blocks);
        setBlocksToHalving(nextHalvingBlock - z_stats.data.blocks);

        const secsToHalving = (nextHalvingBlock - z_stats.data.blocks) * 75;
        const cntDownDate   = Date.now() + secsToHalving * 1000;
        setCountDownDate(cntDownDate);
        setHalvingDate(cntDownDate);
      } catch (err) {
        console.error('An error occurred:', err);
      }
    };

    fetchAllData();
    timer();
  }, [currentBlock]);

  const timer = () => {
    const now = Date.now();
    if (!countDownDate) return;

    const distance = countDownDate - now;
    const d = Math.max(0, distance);

    const dd = String(Math.floor(d / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hh = String(Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const mm = String(Math.floor((d % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const ss = String(Math.floor((d % (1000 * 60)) / 1000)).padStart(2, '0');

    setDays(dd);
    setHours(hh);
    setMinutes(mm);
    setSeconds(ss);

    if (distance > 0) {
      requestAnimationFrame(timer);
    }
  };

  return (
    <div
      className="flex flex-col my-8 space-y-4 border-2 border-blue-200 p-4"
      id="halving-meter"
    >
      <h2 className="font-bold">Halving Meter</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="shadow-lg p-4 rounded-md">
          <h2 className="font-bold text-lg text-blue-500 py-2">Halving Date</h2>
          <div className="pt-2">
            <span>{new Date(halvingDate).toDateString()}</span>
          </div>
        </div>

        <div className="shadow-lg p-4 rounded-md">
          <h2 className="font-bold text-lg text-blue-500 py-2">Blocks Until Halving</h2>
          <div className="pt-2">
            <span>{blocksToHalving.toLocaleString('en-US')}</span>
          </div>
        </div>
      </div>

      <div id="halving-bar" className="flex flex-col space-y-4">
        <h1 className="font-bold mt-8">Halving Progress (%)</h1>
        <div id="progress-box">
          <div id="progress" style={{ width: `${progressPercent.toFixed(2)}%` }} />
          <span id="progress-label" className="font-bold text-white">
            {progressPercent.toFixed(2)}%
          </span>
        </div>
        <h2 id="txt-timer" className="flex justify-center text-xl font-bold">
          {`${days || '00'}d ${hours || '00'}h ${minutes || '00'}m ${seconds || '00'}s to go!`}
        </h2>
      </div>
    </div>
  );
};
