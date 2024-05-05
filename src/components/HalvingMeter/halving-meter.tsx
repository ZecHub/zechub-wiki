'use client';

import { useEffect, useState } from 'react';
import './halving-meter.css';

const api = [
  'https://api.blockchair.com/zcash/stats',
  'https://corsproxy.io/?' +
    encodeURIComponent('https://zcashblockexplorer.com/api/v1/blockchain-info'),
];

const previousHalvingBlock = 1046400;
const nextHalvingBlock = 2726400;
const maxSupply = 21000000;
const blockReward = 3.125;
const blocksPerDay = 1152;
const blocksPerYear = blocksPerDay * 365;
const yearlyZec = blocksPerYear * blockReward;
const dailyZec = blocksPerDay * blockReward;
const inflationRate = (yearlyZec / maxSupply) * 100;

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
  const [halvingDate, setHalvingDate] = useState('');
  const [currentBlock, setCurrentBlock] = useState(0);
  const [blocksPerDay, setBlockPerDay] = useState(1152);

  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  useEffect(() => {
    fetchAllData();
    //   return () => {};
  }, [currentBlock, halvingDate]);

  async function fetchAllData() {
    try {
      const apiData = await Promise.all(api.map((url) => fetchData(url)));

      const bhr = apiData[0];
      const zbe = apiData[1];

      // currentBlock = bhr.data.blocks;
      // blocksToHalving = nextHalvingBlock - currentBlock;
      // secsToHalving = blocksToHalving * 75;
      // countDownDate = new Date().getTime() + secsToHalving * 1000;

      // innHTML.innHalvingDate.innerHTML = new Date(countDownDate).toDateString();
      // innHTML.innToHalving.innerHTML = blocksToHalving.toLocaleString('en-US');

      // function timer() {
      //   const now = new Date().getTime();
      //   const distance = countDownDate - now;
      //   const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      //     .toString()
      //     .padStart(2, '0');
      //   const hours = Math.floor(
      //     (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      //   )
      //     .toString()
      //     .padStart(2, '0');
      //   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      //     .toString()
      //     .padStart(2, '0');
      //   const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      //     .toString()
      //     .padStart(2, '0');

      //   innHTML.innTimer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s to go`;

      //   if (distance > 0) {
      //     requestAnimationFrame(timer);
      //   } else {
      //     alert('Reach @Olek97 on telegram to update the countdown.');
      //   }
      // }
      // timer();

      //Halving progress data
      const totalBlocks = nextHalvingBlock - previousHalvingBlock;
      const completedBlocks = currentBlock - previousHalvingBlock;
      const progressPercent = (completedBlocks / totalBlocks) * 100;

      // Progress bar
      // progress.style.width = progressPercent + '%';

      // Percentage
      // document.querySelector('#progress-label').innerHTML = progressPercent.toFixed(2) + '%';
    } catch (error) {
      console.log('An error occurred:', error);
    }
  }

  return (
    <div className='flex flex-col my-12  space-y-4 border-2  border-blue-300 p-4'>
      <h2 className='font-bold'>Halving Meter</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='shadow-lg p-4 rounded-md'>
          <h2 className='font-bold capitalize text-lg text-blue-500  py-2'>
            Halving Date
          </h2>
          <div className='pt-2'>
            <div>
              <span>{halvingDate}</span>
            </div>
          </div>
        </div>
        <div className='shadow-lg p-4 rounded-md'>
          <h2 className='font-bold capitalize text-lg text-blue-500  py-2'>
            Blocks To Halving
          </h2>
          <div className='pt-2'>
            <div>
              {/* <span>{blocksToHalving.toLocaleString('en-US')}</span> */}
            </div>
          </div>
        </div>
      </div>

      <div id='halving-bar' className='flex flex-col space-y-4'>
        <h1 className='font-bold mt-8'>Halving Progress (%)</h1>
        <div id='progress-box'>
          <div
            id='progress'
            // style={{ width: `${progressPercent.toFixed(2)}%` }}
          ></div>
          <span id='progress-label' className='font-bold'>
            {/* {progressPercent.toFixed(2) + '%'} */}
          </span>
        </div>
        <h2 id='txt-timer'>
          {`${days}d ${hours}h ${minutes}m ${seconds}s to go`}
        </h2>
      </div>
    </div>
  );
};
