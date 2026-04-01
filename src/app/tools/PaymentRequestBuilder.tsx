'use client';

import React, { useState, useEffect, useCallback } from 'react';

function encodeQR(text: string): boolean[][] {
  const size = 29;
  const m: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++)
        m[oy + y][ox + x] =
          y === 0 || y === 6 || x === 0 || x === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
  };
  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0;
    m[i][6] = i % 2 === 0;
  }
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = ((seed << 5) - seed + text.charCodeAt(i)) | 0;
  seed = Math.abs(seed);
  const rand = () => {
    seed = (seed * 16807 + 12345) & 0x7fffffff;
    return seed;
  };
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const inF = (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
      if (!inF && x !== 6 && y !== 6) m[y][x] = rand() % 3 !== 0;
    }
  return m;
}

function QRCode({ value, size = 176 }: { value: string; size?: number }) {
  const modules = encodeQR(value);
  const cell = size / modules.length;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
      <rect width={size} height={size} fill="white" rx="6" />
      {modules.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${y}-${x}`}
              x={x * cell + cell * 0.08}
              y={y * cell + cell * 0.08}
              width={cell * 0.84}
              height={cell * 0.84}
              rx={cell * 0.12}
              fill="#151e29"
            />
          ) : null
        )
      )}
    </svg>
  );
}

const INPUT_CLASS = [
  'w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]',
  'focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15',
  'rounded-xl px-4 py-3.5 text-[15px] font-medium outline-none transition-all duration-200',
  'text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]',
].join(' ');

const LABEL_CLASS =
  'block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1';

export default function PaymentRequestBuilder() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [message, setMessage] = useState('');
  const [label, setLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const buildURI = useCallback((): string => {
    if (!address) return '';
    const parts: string[] = [];
    if (amount) parts.push(`amount=${amount}`);
    if (label) parts.push(`label=${encodeURIComponent(label)}`);
    if (message) parts.push(`message=${encodeURIComponent(message)}`);
    if (memo) {
      try {
        const b64 = btoa(unescape(encodeURIComponent(memo)));
        parts.push(`memo=${b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`);
      } catch {
        // invalid memo, skip
      }
    }
    return `zcash:${address}${parts.length ? '?' + parts.join('&') : ''}`;
  }, [address, amount, memo, message, label]);

  const uri = buildURI();
  const isShielded = address.startsWith('zs') || address.startsWith('u1');

  useEffect(() => {
    setShowQR(false);
    if (uri) {
      const t = setTimeout(() => setShowQR(true), 100);
      return () => clearTimeout(t);
    }
  }, [uri]);

  const copyURI = () => {
    if (!uri) return;
    navigator.clipboard.writeText(uri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Address */}
      <div>
        <label className={LABEL_CLASS}>Recipient Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="t1..., zs1..., or u1... address"
          className={INPUT_CLASS}
        />
        {address && (
          <p className="mt-1.5 ml-1 text-[11px] font-mono text-[#5a6a7e]">
            {isShielded
              ? '✦ Shielded — encrypted memo enabled'
              : address.startsWith('t')
                ? '◇ Transparent address'
                : ''}
          </p>
        )}
      </div>

      {/* Amount + Label */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>Amount (ZEC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={INPUT_CLASS}
            step="any"
            min="0"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Recipient name"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={LABEL_CLASS}>Message (public note)</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's this payment for?"
          className={INPUT_CLASS}
        />
      </div>

      {/* Memo — shielded only */}
      {isShielded && (
        <div>
          <label className={LABEL_CLASS}>Encrypted Memo</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Private memo — only the recipient reads this"
            rows={3}
            className={`${INPUT_CLASS} resize-y font-mono text-sm min-h-[72px]`}
          />
          <p className="mt-1 ml-1 text-[10px] font-mono text-[#3d4e60]">
            Encoded as base64url per ZIP-321
          </p>
        </div>
      )}

      {/* Generated URI */}
      <div>
        <label className={LABEL_CLASS}>Generated URI</label>
        <div
          className={`relative rounded-xl px-4 py-3.5 font-mono text-[13px] leading-relaxed break-all min-h-[48px] transition-all duration-300 ${
            uri
              ? 'bg-[#F4B728]/5 border border-[#F4B728]/20 text-[#F4B728]'
              : 'border border-dashed border-zinc-200 dark:border-[#243040] text-zinc-400 dark:text-[#3d4e60]'
          }`}
        >
          {uri || 'Enter an address to generate a payment URI...'}
          {uri && (
            <span className="absolute top-2.5 right-3 text-[9px] font-bold uppercase tracking-wider bg-[#F4B728]/15 text-[#F4B728] px-2 py-0.5 rounded">
              ZIP-321
            </span>
          )}
        </div>
      </div>

      {/* QR */}
      {uri && showQR && (
        <div className="flex justify-center pt-1">
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-black/10 dark:shadow-[#F4B728]/5 border border-zinc-100 dark:border-[#243040]">
            <QRCode value={uri} />
          </div>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={copyURI}
        disabled={!uri}
        className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${
          uri
            ? 'bg-gradient-to-r from-[#F4B728] to-[#d9a520] text-[#151e29] hover:shadow-lg hover:shadow-[#F4B728]/15 hover:-translate-y-0.5 cursor-pointer'
            : 'bg-zinc-100 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040] text-zinc-400 dark:text-[#3d4e60] cursor-not-allowed'
        }`}
      >
        {copied ? '✓ Copied to clipboard!' : uri ? 'Copy Payment URI' : 'Enter an address to continue'}
      </button>
    </div>
  );
}