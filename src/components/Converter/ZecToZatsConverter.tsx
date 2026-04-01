'use client';

import React, { useState } from 'react';

const ZEC_TO_ZATS = 100_000_000;

export default function ZecToZatsConverter() {
  const [topValue, setTopValue] = useState('1');
  const [bottomValue, setBottomValue] = useState('100000000');
  const [topUnit, setTopUnit] = useState<'ZEC' | 'Zats'>('ZEC');
  const [bottomUnit, setBottomUnit] = useState<'ZEC' | 'Zats'>('Zats');
  const [copiedTop, setCopiedTop] = useState(false);
  const [copiedBottom, setCopiedBottom] = useState(false);

  const formatZats = (value: string) => {
    const num = parseFloat(value) || 0;
    return Math.round(num).toLocaleString('en-US');
  };

  const handleTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (topUnit === 'ZEC') {
      if (val === '' || /^\d*\.?\d{0,8}$/.test(val)) {
        setTopValue(val);
        const num = parseFloat(val) || 0;
        setBottomValue(Math.round(num * ZEC_TO_ZATS).toString());
      }
    } else {
      val = val.replace(/[^0-9]/g, '');
      setTopValue(val);
      const num = parseFloat(val) || 0;
      setBottomValue((num / ZEC_TO_ZATS).toFixed(8));
    }
  };

  const handleBottomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (bottomUnit === 'ZEC') {
      if (val === '' || /^\d*\.?\d{0,8}$/.test(val)) {
        setBottomValue(val);
        const num = parseFloat(val) || 0;
        setTopValue(Math.round(num * ZEC_TO_ZATS).toString());
      }
    } else {
      val = val.replace(/[^0-9]/g, '');
      setBottomValue(val);
      const num = parseFloat(val) || 0;
      setTopValue((num / ZEC_TO_ZATS).toFixed(8));
    }
  };

  const swap = () => {
    setTopValue(bottomValue);
    setBottomValue(topValue);
    setTopUnit(bottomUnit);
    setBottomUnit(topUnit);
  };

  const copyValue = async (value: string, isTop: boolean) => {
    await navigator.clipboard.writeText(value);
    if (isTop) {
      setCopiedTop(true);
      setTimeout(() => setCopiedTop(false), 2000);
    } else {
      setCopiedBottom(true);
      setTimeout(() => setCopiedBottom(false), 2000);
    }
  };

  const displayTop = topUnit === 'Zats' ? formatZats(topValue) : topValue;
  const displayBottom = bottomUnit === 'Zats' ? formatZats(bottomValue) : bottomValue;

  return (
    <div className="w-full space-y-4">
      {/* Rate badge */}
      <div className="flex justify-center mb-1">
        <span className="text-xs font-semibold tracking-wide text-[#F4B728] bg-[#F4B728]/10 border border-[#F4B728]/15 px-3 py-1.5 rounded-full">
          1 ZEC = 100,000,000 Zats
        </span>
      </div>

      {/* Top input */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1">
          {topUnit}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode={topUnit === 'ZEC' ? 'decimal' : 'numeric'}
            value={displayTop}
            onChange={handleTopChange}
            className="w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]
                       focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15
                       rounded-xl px-5 py-4 pr-16 text-2xl sm:text-3xl font-bold outline-none
                       transition-all duration-200 text-zinc-900 dark:text-white
                       placeholder-zinc-300 dark:placeholder-[#2d3e50]"
            placeholder={topUnit === 'ZEC' ? '0.00000000' : '0'}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-[#4a5a6e] pointer-events-none">
            {topUnit}
          </span>
        </div>
      </div>

      {/* Swap */}
      <div className="flex justify-center -my-1">
        <button
          onClick={swap}
          aria-label="Swap units"
          className="group p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]
                     hover:border-[#F4B728]/50 hover:bg-[#F4B728]/5 active:scale-95
                     transition-all duration-200"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-400 dark:text-[#4a5a6e] group-hover:text-[#F4B728] transition-colors stroke-current"
          >
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Bottom input */}
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1">
          {bottomUnit}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode={bottomUnit === 'ZEC' ? 'decimal' : 'numeric'}
            value={displayBottom}
            onChange={handleBottomChange}
            className="w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]
                       focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15
                       rounded-xl px-5 py-4 pr-16 text-2xl sm:text-3xl font-bold outline-none
                       transition-all duration-200 text-zinc-900 dark:text-white
                       placeholder-zinc-300 dark:placeholder-[#2d3e50]"
            placeholder={bottomUnit === 'ZEC' ? '0.00000000' : '0'}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-[#4a5a6e] pointer-events-none">
            {bottomUnit}
          </span>
        </div>
      </div>

      {/* Copy buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {[
          { copied: copiedTop, unit: topUnit, val: topValue, isTop: true },
          { copied: copiedBottom, unit: bottomUnit, val: bottomValue, isTop: false },
        ].map(({ copied, unit, val, isTop }) => (
          <button
            key={unit}
            onClick={() => copyValue(val, isTop)}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                        transition-all duration-200 active:scale-[0.97] border ${
                          copied
                            ? 'bg-[#F4B728] border-[#F4B728] text-[#0f1720]'
                            : 'bg-zinc-50 dark:bg-[#0f1720] border-zinc-200 dark:border-[#243040] text-zinc-500 dark:text-[#5a6a7e] hover:border-[#F4B728]/50 hover:text-[#F4B728]'
                        }`}
          >
            {copied ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            {copied ? 'Copied!' : `Copy ${unit}`}
          </button>
        ))}
      </div>
    </div>
  );
}