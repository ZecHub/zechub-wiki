declare module '@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js' {
  export function __wbg_set_wasm(val: unknown): void;
  export function normalize_zcash_address(addr: string): string;
  export function is_valid_zcash_address(addr: string): boolean;
  export function get_zcash_address_type(addr: string): string;
  export function get_address_receivers(addr: string): {
    p2pkh: string | null;
    p2sh: string | null;
    sapling: string | null;
    orchard: string | null;
    tex: string | null;
  };
}