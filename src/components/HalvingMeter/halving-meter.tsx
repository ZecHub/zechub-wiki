'use client';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { DATA_URL } from '@/lib/chart/data-url';
import { getBlockchainData } from '@/lib/chart/helpers';

const SECOND_HALVING_HEIGHT = 2_726_400;
const PRE_NU7_INTERVAL = 1_680_000;
const NU7_HEIGHT = 3_543_405;
const PRE_NU7_SECONDS = 75;
const POST_NU7_SECONDS = 25;
const SPACING_RATIO = PRE_NU7_SECONDS / POST_NU7_SECONDS;
const POST_NU7_INTERVAL = PRE_NU7_INTERVAL * SPACING_RATIO;

// ZIP 218 preserves elapsed target time when the spacing changes at the
// ZIP 259 mainnet activation height. The remaining legacy blocks take three
// times as many post-activation blocks to cover the same duration.
const FIRST_NU7_HALVING_HEIGHT = NU7_HEIGHT
  + (SECOND_HALVING_HEIGHT + PRE_NU7_INTERVAL - NU7_HEIGHT) * SPACING_RATIO;

function estimateHalving(height: number) {
  const elapsedIntervals = Math.max(
    0,
    Math.floor((height - FIRST_NU7_HALVING_HEIGHT) / POST_NU7_INTERVAL) + 1,
  );
  const targetHeight = FIRST_NU7_HALVING_HEIGHT + elapsedIntervals * POST_NU7_INTERVAL;
  const beforeNu7 = Math.max(0, NU7_HEIGHT - height);
  const afterNu7 = targetHeight - Math.max(height, NU7_HEIGHT);
  const secondsRemaining = beforeNu7 * PRE_NU7_SECONDS + afterNu7 * POST_NU7_SECONDS;
  const intervalSeconds = POST_NU7_INTERVAL * POST_NU7_SECONDS;
  return {
    height,
    targetHeight,
    blocksRemaining: targetHeight - height,
    at: Date.now() + secondsRemaining * 1000,
    progressPercent: Math.max(0, (1 - secondsRemaining / intervalSeconds) * 100),
  };
}

type HalvingMeterProps = {
  chartRef?: RefObject<HTMLDivElement | null>;
};

export const HalvingMeter = (props: HalvingMeterProps) => {
  const [estimate, setEstimate] = useState<ReturnType<typeof estimateHalving> | null>(null);
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getBlockchainData(DATA_URL.blockchainDataUrl, controller.signal).then((chain) => {
      if (controller.signal.aborted) return;
      const height = chain?.blocks;
      if (typeof height === 'number' && Number.isSafeInteger(height) && height >= 0) {
        setEstimate(estimateHalving(height));
      }
        setLoading(false);
    });
    return () => controller.abort();
  }, []);

  const countDownDate = estimate?.at;

  // Separate effect for the countdown timer
  useEffect(() => {
    if (countDownDate === undefined) return;

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

  if (!estimate) {
    return (
      <div className='flex flex-col my-8 space-y-4 border-2 border-blue-200 p-4'>
        <h2 className='font-bold'>Halving Meter</h2>
        <p>Halving data is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div
      ref={props.chartRef}
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
              <span>{estimate.height.toLocaleString('en-US')}</span>
            </div>
          </div>
        </div>
        <div className='shadow-lg p-4 rounded-md'>
          <h2 className='font-bold capitalize text-lg text-blue-500 py-2'>
            Estimated Halving Date (UTC)
          </h2>
          <div className='pt-2'>
            <div>
              <span>{new Date(estimate.at).toISOString().slice(0, 10)}</span>
            </div>
          </div>
        </div>
        <div className='shadow-lg p-4 rounded-md'>
          <h2 className='font-bold capitalize text-lg text-blue-500 py-2'>
            Blocks Until Halving
          </h2>
          <div className='pt-2'>
            <div>
              <span>{estimate.blocksRemaining.toLocaleString('en-US')}</span>
              <p className='mt-1 text-sm'>Target block {estimate.targetHeight.toLocaleString('en-US')}</p>
            </div>
          </div>
        </div>
      </div>
      <div id='halving-bar' className='flex flex-col space-y-4'>
        <h1 className='font-bold mt-8'>Halving Progress (%)</h1>
        <div className='relative w-full h-12 bg-gray-200 rounded-lg overflow-hidden'>
          <div
            className='absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300'
            style={{ width: `${estimate.progressPercent.toFixed(2)}%` }}
          ></div>
          <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-gray-800 z-10'>
            {estimate.progressPercent.toFixed(2) + '%'}
          </span>
        </div>
        <h2 className='flex justify-center text-xl font-bold'>
          {`${days}d ${hours}h ${minutes}m ${seconds}s to go!`}
        </h2>
      </div>
      
      {/* Highlighted Information Box */}
      <div className='bg-yellow-50 dark:bg-gray-800 border border-yellow-200 rounded-lg p-4 mt-4'>
        <p className='text-sm dark:text-white text-yellow-800 font-medium'>
          The date is an estimate based on target block spacing.
        </p>
        <p className='text-sm dark:text-white text-yellow-700 mt-2'>
          NU7 targets 25-second blocks. ZIP 237 preserves scheduled halvings and reissues funds from the Network Sustainability Mechanism balance separately.
        </p>
        <div className='text-sm dark:text-white text-yellow-700 mt-2'>
          <p className='font-medium'>Learn More:</p>
          <a 
            href='https://zips.z.cash/zip-0237'
            target='_blank' 
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 underline'
          >
            ZIP 237
          </a>
        </div>
      </div>
    </div>
  );
};
