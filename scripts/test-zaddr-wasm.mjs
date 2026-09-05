import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicAsset = resolve(root, "public/wasm/zaddr_wasm_parser_bg.wasm");
const packageAsset = resolve(root, "node_modules/@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.wasm");
const asset = await access(publicAsset).then(() => publicAsset).catch(() => packageAsset);
const bytes = await readFile(asset);
const glue = await import("@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js");
const { instance } = await WebAssembly.instantiate(bytes, {
  "./zaddr_wasm_parser_bg.js": glue,
});
glue.__wbg_set_wasm(instance.exports);
instance.exports.__wbindgen_start();

// A real Unified Address fixture exercises the parser and its transparent,
// Sapling, and Orchard receiver extraction in one production-like call.
const unified = "u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89";
if (!glue.is_valid_zcash_address(unified)) throw new Error("Unified fixture was rejected");
if (glue.get_zcash_address_type(unified) !== "unified") throw new Error("Unified type was not detected");
const receivers = glue.get_address_receivers(unified);
for (const key of ["p2pkh", "sapling", "orchard"]) {
  if (!receivers[key]) throw new Error(`Unified fixture is missing ${key} receiver`);
  if (!glue.is_valid_zcash_address(receivers[key])) throw new Error(`${key} receiver was rejected`);
}

console.log(`zaddr WASM smoke test passed (${asset})`);
