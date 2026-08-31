import { useCallback, useEffect, useRef, useState } from "react";

export interface ZaddrModuleAny {
  isZcashAddressValid?: (addr: string) => boolean;
  getZcashAddressType?: (addr: string) => string;
  getAddressReceivers?: (addr: string) => AddressReceivers;
  is_valid_zcash_address?: (addr: string) => boolean;
  get_zcash_address_type?: (addr: string) => string;
  get_address_receivers?: (addr: string) => AddressReceivers;
  [key: string]: unknown;
}

const WASM_ASSET = "/wasm/zaddr_wasm_parser_bg.wasm";
const MAX_ATTEMPTS = 3;

export type WasmLoadState = "loading" | "retrying" | "ready" | "error";

/**
 * Load the generated bindings separately from the binary. The npm entrypoint
 * uses instantiateStreaming internally, which is fragile when a CDN/proxy
 * returns an error document or an incorrect content type for the .wasm URL.
 */
export async function loadZaddrWasm(
  fetchImpl: typeof fetch = fetch,
  onRetry?: () => void,
): Promise<ZaddrModuleAny> {
  const glue = (await import(
    "@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js"
  )) as typeof import("@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js");

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchImpl(WASM_ASSET, {
        cache: "no-store",
        headers: { Accept: "application/wasm" },
      });

      if (!response.ok) {
        throw new Error(`WASM asset request failed (${response.status})`);
      }

      const bytes = await response.arrayBuffer();
      if (bytes.byteLength === 0) {
        throw new Error("WASM asset was empty");
      }

      // wasm-bindgen names its JavaScript imports after the generated glue
      // module, so provide that namespace when instantiating manually.
      const { instance } = await WebAssembly.instantiate(bytes, {
        "./zaddr_wasm_parser_bg.js": glue,
      });
      glue.__wbg_set_wasm(instance.exports);
      instance.exports.__wbindgen_start();
      return glue;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        onRetry?.();
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to initialize the Zcash address decoder");
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
  const [wasmState, setWasmState] = useState<WasmLoadState>("loading");

  const wasmMmoduleRef = useRef<ZaddrModuleAny | null>(null);

  const initialize = useCallback(async () => {
    setWasmReady(false);
    setWasmError(null);
    setWasmState("loading");

    try {
      const mod = await loadZaddrWasm(fetch, () => setWasmState("retrying"));
      wasmMmoduleRef.current = mod;
      setWasmReady(true);
      setWasmState("ready");
    } catch (err: unknown) {
      console.error("[AddressDecoder] WASM load failed:", err);
      setWasmState("error");
      setWasmError(
        err instanceof Error ? err.message : "Failed to load WASM module",
      );
    }
  }, []);

  useEffect(() => {
    initialize().catch(() => undefined);
  }, [initialize]);

  return {
    wasmError,
    wasmReady,
    wasmState,
    wasmMmoduleRef,
    retryWasm: initialize,
  };
}
