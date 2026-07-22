// Copies the pdf.js worker into public/ so PDFViewer can load it same-origin
// instead of fetching it from a third-party CDN (unpkg).
//
// The worker is resolved from the *same* pdfjs-dist that react-pdf uses, so its
// version always matches `pdfjs.version` at runtime — a mismatch would make
// pdf.js throw "API version does not match Worker version".
//
// Runs automatically via the `predev` and `prebuild` npm lifecycle scripts.
import { createRequire } from "node:module";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "/"));

const reactPdfDir = path.dirname(require.resolve("react-pdf/package.json"));
const workerSrc = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs", {
  paths: [reactPdfDir],
});

const destDir = path.join(process.cwd(), "public");
const dest = path.join(destDir, "pdf.worker.min.mjs");

mkdirSync(destDir, { recursive: true });
copyFileSync(workerSrc, dest);

console.log(`[copy-pdf-worker] ${path.relative(process.cwd(), workerSrc)} -> public/pdf.worker.min.mjs`);
