import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  root,
  "node_modules/@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.wasm",
);
const destination = resolve(root, "public/wasm/zaddr_wasm_parser_bg.wasm");

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);
console.log("Copied zaddr WASM asset to public/wasm/");
