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

  const handleTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (topUnit === 'ZEC') {
      if (val === '' || /^\d*\.?\d{0,8}$/.test(val)) setTopValue(val);
    } else {
      setTopValue(val.replace(/[^0-9]/g, ''));
    }
    updateBottom();
  };

  const handleBottomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (bottomUnit === 'Zats') setBottomValue(val);
    else if (val === '' || /^\d*\.?\d{0,8}$/.test(val)) setBottomValue(val);
    updateTop();
  };

  const updateBottom = () => {
    const num = parseFloat(topValue) || 0;
    setBottomValue(Math.round(num * ZEC_TO_ZATS).toString());
  };

  const updateTop = () => {
    const num = parseFloat(bottomValue) || 0;
    setTopValue((num / ZEC_TO_ZATS).toFixed(8));
  };

  const swap = () => {
    const tempValue = topValue;
    const tempUnit = topUnit;
    setTopValue(bottomValue);
    setBottomValue(tempValue);
    setTopUnit(bottomUnit);
    setBottomUnit(tempUnit);
  };

  const copy = async (value: string, isTop: boolean) => {
    await navigator.clipboard.writeText(value);
    if (isTop) {
      setCopiedTop(true);
      setTimeout(() => setCopiedTop(false), 2000);
    } else {
      setCopiedBottom(true);
      setTimeout(() => setCopiedBottom(false), 2000);
    }
  };

  return (
    <div className="max-w-[420px] mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-7 text-white text-center">
          <h3 className="text-2xl font-bold">ZEC ↔ Zats</h3>
          <p className="text-sm opacity-90">1 ZEC = 100,000,000 Zats</p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">{topUnit}</label>
            <div className="relative">
              <input
                type="text"
                value={topUnit === 'Zats' ? parseFloat(topValue).toLocaleString('en-US') : topValue}
                onChange={handleTopChange}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:border-emerald-500 rounded-2xl px-6 py-5 text-4xl font-semibold outline-none"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-zinc-400">{topUnit}</div>
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={swap} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl hover:border-emerald-500 transition-all">
              <ArrowUpDown className="w-6 h-6" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">{bottomUnit}</label>
            <div className="relative">
              <input
                type="text"
                value={bottomUnit === 'Zats' ? parseFloat(bottomValue).toLocaleString('en-US') : bottomValue}
                onChange={handleBottomChange}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:border-emerald-500 rounded-2xl px-6 py-5 text-4xl font-semibold outline-none"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-zinc-400">{bottomUnit}</div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 grid grid-cols-2 gap-4">
          <button onClick={() => copy(topValue, true)} className="flex items-center justify-center gap-2 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl font-medium transition-all">
            {copiedTop ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />} Copy {topUnit}
          </button>
          <button onClick={() => copy(bottomValue, false)} className="flex items-center justify-center gap-2 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-2xl font-medium transition-all">
            {copiedBottom ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />} Copy {bottomUnit}
          </button>
        </div>
      </div>
    </div>
  );
}
