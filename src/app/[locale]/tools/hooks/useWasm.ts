import { useEffect, useRef, useState } from "react";
import * as zaddrWasmBindings from "@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js";

export interface ZaddrModuleAny {
  initWasm?: () => Promise<void>;
  isZcashAddressValid?: (addr: string) => boolean;
  getZcashAddressType?: (addr: string) => string;
  getAddressReceivers?: (addr: string) => AddressReceivers;
  is_valid_zcash_address?: (addr: string) => boolean;
  get_zcash_address_type?: (addr: string) => string;
  get_address_receivers?: (addr: string) => AddressReceivers;
  [key: string]: unknown;
}

export interface AddressReceivers {
  p2pkh: string | null;
  p2sh: string | null;
  sapling: string | null;
  orchard: string | null;
  tex: string | null;
}

let wasmModulePromise: Promise<ZaddrModuleAny> | null = null;

function loadWasmModule() {
  if (wasmModulePromise) return wasmModulePromise;

  wasmModulePromise = (async () => {
    const response = await fetch("/zaddr_wasm_parser_bg.wasm");
    if (!response.ok) {
      throw new Error(
        `WASM asset request failed (${response.status} ${response.statusText})`,
      );
    }

    const bytes = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes, {
      "./zaddr_wasm_parser_bg.js": zaddrWasmBindings,
    });

    zaddrWasmBindings.__wbg_set_wasm(instance.exports);
    (
      instance.exports as WebAssembly.Exports & {
        __wbindgen_start: () => void;
      }
    ).__wbindgen_start();

    return zaddrWasmBindings as ZaddrModuleAny;
  })().catch((error) => {
    wasmModulePromise = null;
    throw error;
  });

  return wasmModulePromise;
}

export function useWasm() {
  const [wasmReady, setWasmReady] = useState(false);
  const [wasmError, setWasmError] = useState<string | null>(null);

  const wasmMmoduleRef = useRef<ZaddrModuleAny | null>(null);

  /* ── Load WASM on mount ── */
  useEffect(() => {
    let cancelled = false;

    async function loadWasm() {
      try {
        const mod = await loadWasmModule();

        if (!cancelled) {
          wasmMmoduleRef.current = mod;
          setWasmReady(true);
        }
      } catch (err: unknown) {
        console.error("[AddressDecoder] WASM load failed:", err);
        if (!cancelled) {
          setWasmError(
            err instanceof Error ? err.message : "Failed to load WASM module",
          );
        }
      }
    }

    loadWasm();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    wasmError,
    wasmReady,
    wasmMmoduleRef,
  };
}
