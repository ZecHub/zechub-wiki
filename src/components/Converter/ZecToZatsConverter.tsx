'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowUpDown } from 'lucide-react';

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
    <div className="max-w-[420px] mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-7 text-white">
          <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            ZEC ↔ Zats
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-mono">1 ZEC = 100M Zats</span>
          </h3>
        </div>

        <div className="p-8 space-y-8">
          {/* Top Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              {topUnit}
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayTop}
                onChange={handleTopChange}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:border-emerald-500 rounded-2xl px-6 py-5 text-4xl font-semibold outline-none transition-all"
                placeholder={topUnit === 'ZEC' ? "0.00000000" : "0"}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                {topUnit}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swap}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl hover:border-emerald-500 transition-all active:scale-95 shadow-sm"
            >
              <ArrowUpDown className="w-6 h-6 text-zinc-500" />
            </button>
          </div>

          {/* Bottom Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              {bottomUnit}
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayBottom}
                onChange={handleBottomChange}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:border-emerald-500 rounded-2xl px-6 py-5 text-4xl font-semibold outline-none transition-all"
                placeholder={bottomUnit === 'ZEC' ? "0.00000000" : "0"}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                {bottomUnit}
              </div>
            </div>
          </div>
        </div>

        {/* Copy Buttons */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => copyValue(topValue, true)}
            className="flex items-center justify-center gap-2 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl font-medium transition-all"
          >
            {copiedTop ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            Copy {topUnit}
          </button>
          <button
            onClick={() => copyValue(bottomValue, false)}
            className="flex items-center justify-center gap-2 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl font-medium transition-all"
          >
            {copiedBottom ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            Copy {bottomUnit}
          </button>
        </div>
      </div>
    </div>
  );
}
