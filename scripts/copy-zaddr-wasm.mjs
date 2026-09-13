// Copies the zaddr parser binary into public/ so browser clients can load it
// from a stable same-origin URL. The npm package's generated wrapper uses a
// relative bundler import, which can resolve to a missing asset after deploy.
import { createRequire } from "node:module";
import { copyFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "/"));
const packageDir = path.dirname(
  require.resolve("@elemental-zcash/zaddr_wasm_parser/package.json"),
);
const source = path.join(packageDir, "zaddr_wasm_parser_bg.wasm");
const destination = path.join(
  process.cwd(),
  "public",
  "zaddr_wasm_parser_bg.wasm",
);

copyFileSync(source, destination);
console.log(
  `[copy-zaddr-wasm] ${path.relative(process.cwd(), source)} -> public/zaddr_wasm_parser_bg.wasm`,
);
