# Zcash Tools deployment

The address decoder loads `@elemental-zcash/zaddr_wasm_parser` bindings and
the generated WASM binary from the same-origin URL
`/wasm/zaddr_wasm_parser_bg.wasm`. The `predev` and `prebuild` scripts copy the
binary from `node_modules` into `public/wasm/`.

## Production checklist

1. Deploy with `yarn build` (Vercel runs the repository `prebuild` hook).
2. Confirm the deployed URL `/wasm/zaddr_wasm_parser_bg.wasm` returns HTTP 200,
   a non-empty body, and `Content-Type: application/wasm`.
3. Open `/en/tools?tool=address-decoder` in a production browser. The status
   should become “WASM decoder ready”, then decode a `t1`, `t3`, `zs1`, `u1`,
   `utest1`, or `tex1` address.
4. If the asset is temporarily unavailable, the decoder retries three times
   and exposes a Retry button; do not cache an error document at the WASM URL.

The loader uses `arrayBuffer()` after checking `response.ok`, so a CDN error
page cannot be passed to WebAssembly compilation as if it were the binary.
