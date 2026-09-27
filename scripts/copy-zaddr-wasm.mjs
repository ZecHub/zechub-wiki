import { createRequire } from "node:module";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "/"));

const pkgDir = path.dirname(
  require.resolve("@elemental-zcash/zaddr_wasm_parser/package.json"),
);
const src = path.join(pkgDir, "zaddr_wasm_parser_bg.wasm");
const destDir = path.join(process.cwd(), "public", "wasm");
const dest = path.join(destDir, "zaddr_wasm_parser_bg.wasm");

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);

console.log(
  `[copy-zaddr-wasm] ${path.relative(process.cwd(), src)} -> public/wasm/zaddr_wasm_parser_bg.wasm`,
);