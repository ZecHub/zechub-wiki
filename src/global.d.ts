
declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Allow side-effect imports
declare module "*.css" {}

declare module "@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js" {
  export function __wbg_set_wasm(value: WebAssembly.Exports): void;
  export function is_valid_zcash_address(address: string): boolean;
  export function get_zcash_address_type(address: string): string;
  export function get_address_receivers(address: string): unknown;
}
