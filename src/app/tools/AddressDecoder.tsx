'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/*
 * UNIFIED ADDRESS DECODER
 * Uses @elemental-zcash/zaddr_wasm_parser (Rust → WASM)
 * Browser equivalent of: zcash-cli z_listunifiedreceivers <address>
 */

interface AddressReceivers {
  p2pkh: string | null;
  p2sh: string | null;
  sapling: string | null;
  orchard: string | null;
  tex: string | null;
}

interface ZaddrModuleAny {
  initWasm?: () => Promise<void>;
  isZcashAddressValid?: (addr: string) => boolean;
  getZcashAddressType?: (addr: string) => string;
  getAddressReceivers?: (addr: string) => AddressReceivers;
  is_valid_zcash_address?: (addr: string) => boolean;
  get_zcash_address_type?: (addr: string) => string;
  get_address_receivers?: (addr: string) => AddressReceivers;
  [key: string]: unknown;
}

function QRCode({ value, size = 176 }: { value: string; size?: number }) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#151e29"
      level="M"
    />
  );
}
/* ── Receiver display config ── */
const RECEIVER_META: Record<string, { label: string; icon: string; accent: string }> = {
  p2pkh: { label: 'Transparent (P2PKH)', icon: '◇', accent: '#64748b' },
  p2sh: { label: 'Script (P2SH)', icon: '◈', accent: '#6b7280' },
  sapling: { label: 'Sapling', icon: '✦', accent: '#34d399' },
  orchard: { label: 'Orchard', icon: '❋', accent: '#a78bfa' },
  tex: { label: 'TEX (P2PKH wrapped)', icon: '⬡', accent: '#fb923c' },
  full: { label: 'Full Address', icon: '⬡', accent: '#F4B728' },
};

const INPUT_CLASS = [
  'w-full bg-zinc-50 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040]',
  'focus:border-[#F4B728] focus:ring-2 focus:ring-[#F4B728]/15',
  'rounded-xl px-4 py-3.5 text-[15px] font-medium outline-none transition-all duration-200',
  'text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-[#2d3e50]',
].join(' ');

const LABEL_CLASS =
  'block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-[#5a6a7e] mb-1.5 ml-1';

export default function AddressDecoder() {
  const [input, setInput] = useState('');
  const [receivers, setReceivers] = useState<Array<{ key: string; address: string }>>([]);
  const [addressType, setAddressType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [wasmError, setWasmError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const moduleRef = useRef<ZaddrModuleAny | null>(null);

  /* ── Load WASM on mount ── */
  useEffect(() => {
    let cancelled = false;

    async function loadWasm() {
      try {
        const mod: ZaddrModuleAny = await import('@elemental-zcash/zaddr_wasm_parser');

        if (typeof mod.initWasm === 'function') {
          await mod.initWasm();
        }

        if (!cancelled) {
          moduleRef.current = mod;
          setWasmReady(true);
        }
      } catch (err: unknown) {
        console.error('[AddressDecoder] WASM load failed:', err);
        if (!cancelled) {
          setWasmError(err instanceof Error ? err.message : 'Failed to load WASM module');
        }
      }
    }

    loadWasm();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Decode when input changes ── */
  const decode = useCallback(() => {
    setError(null);
    setReceivers([]);
    setAddressType(null);
    setSelectedQR(null);

    const addr = input.trim();
    if (!addr || !moduleRef.current) return;

    setLoading(true);
    try {
      const mod = moduleRef.current;

      const validateFn = mod.isZcashAddressValid ?? mod.is_valid_zcash_address;
      const typeFn = mod.getZcashAddressType ?? mod.get_zcash_address_type;
      const receiversFn = mod.getAddressReceivers ?? mod.get_address_receivers;

      if (!validateFn || !receiversFn) {
        setError('WASM module loaded but expected functions not found');
        setLoading(false);
        return;
      }

      if (!validateFn(addr)) {
        setError('Not a valid Zcash address');
        setLoading(false);
        return;
      }

      if (typeFn) {
        setAddressType(typeFn(addr));
      }

      const result: AddressReceivers = receiversFn(addr);

      const list: Array<{ key: string; address: string }> = [];
      if (result.p2pkh) list.push({ key: 'p2pkh', address: result.p2pkh });
      if (result.p2sh) list.push({ key: 'p2sh', address: result.p2sh });
      if (result.sapling) list.push({ key: 'sapling', address: result.sapling });
      if (result.orchard) list.push({ key: 'orchard', address: result.orchard });
      if (result.tex) list.push({ key: 'tex', address: result.tex });
      list.push({ key: 'full', address: addr });

      setReceivers(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to decode address');
    } finally {
      setLoading(false);
    }
  }, [input]);

  useEffect(() => {
    if (!wasmReady) return;
    const t = setTimeout(decode, 200);
    return () => clearTimeout(t);
  }, [input, decode, wasmReady]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getMeta = (key: string) =>
    RECEIVER_META[key] || { label: key, icon: '•', accent: '#64748b' };

  return (
    <div className="w-full space-y-4">
      {/* WASM load error */}
      {wasmError && (
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 px-4 py-3.5 space-y-2.5">
          <p className="text-[13px] text-amber-400 font-semibold">Failed to initialize WASM decoder</p>
          <p className="text-[12px] text-zinc-500 dark:text-[#5a6a7e] leading-relaxed">
            This tool requires{' '}
            <code className="text-[#F4B728]/80 text-[11px]">@elemental-zcash/zaddr_wasm_parser</code> to
            decode addresses in the browser.
          </p>
          <details className="text-[11px]">
            <summary className="text-zinc-400 dark:text-[#4a5a6e] cursor-pointer hover:text-[#F4B728] transition-colors">
              Error details
            </summary>
            <pre className="mt-2 text-[10px] text-red-400/70 bg-zinc-100 dark:bg-[#0f1720] border border-zinc-200 dark:border-[#243040] rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap">
              {wasmError}
            </pre>
          </details>
        </div>
      )}

      {/* WASM ready */}
      {wasmReady && (
        <div className="flex items-center gap-2 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-emerald-400/70">WASM decoder ready</span>
        </div>
      )}

      {/* Input */}
      <div>
        <label className={LABEL_CLASS}>Zcash Address</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            wasmReady
              ? 'Paste any Zcash address (t1, zs1, u1, tex1...)'
              : wasmError
                ? 'WASM decoder unavailable'
                : 'Loading WASM decoder...'
          }
          disabled={!wasmReady}
          className={`${INPUT_CLASS} ${!wasmReady ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Loading WASM */}
      {!wasmReady && !wasmError && (
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-4 h-4 border-2 border-[#F4B728]/20 border-t-[#F4B728] rounded-full animate-spin" />
          <span className="text-[12px] text-zinc-400 dark:text-[#4a5a6e]">Initializing WASM decoder...</span>
        </div>
      )}

      {/* Address type badge */}
      {addressType && (
        <div className="ml-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4B728]/10 border border-[#F4B728]/15 text-[#F4B728] px-2.5 py-1 rounded">
            {addressType}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-500/5 border border-red-500/15 px-4 py-3">
          <p className="text-[13px] text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Decode loading */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-[#F4B728]/30 border-t-[#F4B728] rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!input && wasmReady && (
        <div className="rounded-xl bg-[#F4B728]/5 border border-[#F4B728]/10 px-5 py-4">
          <p className="text-sm text-zinc-500 dark:text-[#5a6a7e] leading-relaxed">
            <span className="font-bold text-[#F4B728]">Unified Addresses</span> bundle multiple receiver
            types into a single address. Paste any Zcash address above to decode its receivers and
            generate individual QR codes.
          </p>
          <p className="text-xs text-zinc-400 dark:text-[#3d4e60] mt-2 font-mono">
            Supports: t1 (transparent) · zs1 (sapling) · u1 (unified) · tex1 (TEX)
          </p>
        </div>
      )}

      {/* Decoded receivers */}
      {receivers.length > 0 && (
        <div className="space-y-2.5">
          {receivers.map((r) => {
            const meta = getMeta(r.key);
            const isOpen = selectedQR === r.key;
            const isCopied = copiedId === r.key;

            return (
              <div
                key={r.key}
                onClick={() => setSelectedQR(isOpen ? null : r.key)}
                className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                  isOpen
                    ? 'bg-zinc-50 dark:bg-[#0f1720] border-[#F4B728]/25'
                    : 'bg-zinc-50 dark:bg-[#111b27] border-zinc-200 dark:border-[#1e2d3d] hover:border-zinc-300 dark:hover:border-[#2d3e50]'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-base"
                    style={{ backgroundColor: `${meta.accent}12`, color: meta.accent }}
                  >
                    {meta.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold" style={{ color: meta.accent }}>
                      {meta.label}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 dark:text-[#3d4e60] truncate mt-0.5">
                      {r.address}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copy(r.address, r.key);
                    }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 border ${
                      isCopied
                        ? 'bg-[#F4B728] border-[#F4B728] text-[#151e29]'
                        : 'bg-transparent border-zinc-200 dark:border-[#1e2d3d] text-zinc-400 dark:text-[#4a5a6e] hover:border-[#F4B728]/50 hover:text-[#F4B728]'
                    }`}
                  >
                    {isCopied ? '✓ Copied' : 'Copy'}
                  </button>

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`flex-shrink-0 text-zinc-300 dark:text-[#2d3e50] transition-transform duration-200 stroke-current ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {isOpen && (
                  <div className="flex justify-center pb-4 pt-1">
                    <div className="p-3 bg-white rounded-xl shadow-lg shadow-black/5 border border-zinc-100 dark:border-[#1e2d3d]">
                      <QRCode value={r.address} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}