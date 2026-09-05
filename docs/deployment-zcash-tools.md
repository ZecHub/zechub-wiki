# Zcash Tools deployment

The address decoder loads `@elemental-zcash/zaddr_wasm_parser` bindings and
the generated WASM binary from the same-origin URL
`/wasm/zaddr_wasm_parser_bg.wasm`. The `predev` and `prebuild` scripts copy the
binary from `node_modules` into `public/wasm/`.

## Build and deploy

Install dependencies with the repository-pinned Yarn version, then build the
production bundle. The `prebuild` hook copies the exact WASM file installed
from the lockfile into `public/wasm/`; do not replace it with a remote CDN URL.

```bash
yarn install --frozen-lockfile
yarn build
yarn start
```

For Vercel, use `yarn build` as the build command and keep the project root at
the repository root. Vercel runs `prebuild` automatically before the command.

## Production checklist

1. Deploy with `yarn build` (Vercel runs the repository `prebuild` hook).
2. Confirm the deployed URL `/wasm/zaddr_wasm_parser_bg.wasm` returns HTTP 200,
   a non-empty body, and `Content-Type: application/wasm`:

   ```bash
   curl -fsSI https://YOUR_DOMAIN/wasm/zaddr_wasm_parser_bg.wasm
   curl -fsS https://YOUR_DOMAIN/wasm/zaddr_wasm_parser_bg.wasm | head -c 4 | od -An -t x1
   ```

   The first four bytes must be `00 61 73 6d` (`\0asm`).
3. Open `/en/tools?tool=address-decoder` in a production browser on desktop
   and a narrow mobile viewport. The status should become “WASM decoder ready”,
   then decode fixtures covering transparent P2PKH/P2SH, Sapling, Unified
   (including Orchard receivers), and TEX on mainnet and testnet.
4. If the asset is temporarily unavailable, the decoder retries three times
   and exposes a Retry button; do not cache an error document at the WASM URL.

The loader uses `arrayBuffer()` after checking `response.ok` and validates the
`\0asm` signature, so a CDN error page cannot be passed to WebAssembly
compilation as if it were the binary. It retries transient failures three
times with backoff and exposes a user-triggered retry after a final failure.

Run the automated checks before deployment:

```bash
yarn test
yarn build
```

After deployment, inspect the browser console and Network panel for the WASM
request. A successful verification has status 200, the WASM content type, the
magic bytes above, and no WebAssembly compile or instantiate errors.
