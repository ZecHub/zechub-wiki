declare module "@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js" {
  export function __wbg_set_wasm(wasm: WebAssembly.Exports): void;

  export function normalize_zcash_address(addrStr: string): string;
  export function is_valid_zcash_address(addrStr: string): boolean;
  export function get_zcash_address_type(addrStr: string): string;
  export function get_address_receivers(addrStr: string): unknown;

  export class AddressReceivers {
    free(): void;
  }
}
