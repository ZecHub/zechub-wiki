import { useEffect, useRef, useState } from "react";

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

export function useWasm() {
  const [wasmReady, setWasmReady] = useState(false);
  const [wasmError, setWasmError] = useState<string | null>(null);

  const wasmMmoduleRef = useRef<ZaddrModuleAny | null>(null);

  /* ── Load WASM on mount ── */
  useEffect(() => {
    let cancelled = false;

    async function loadWasm() {
      try {
        const mod: ZaddrModuleAny =
          await import("@elemental-zcash/zaddr_wasm_parser");

        if (typeof mod.initWasm === "function") {
          await mod.initWasm();
        }

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
