import { loadZaddrWasm } from "./useWasm";

jest.mock(
  "@elemental-zcash/zaddr_wasm_parser/zaddr_wasm_parser_bg.js",
  () => ({
    __wbg_set_wasm: jest.fn(),
    __wbindgen_start: jest.fn(),
    is_valid_zcash_address: jest.fn(),
    get_zcash_address_type: jest.fn(),
    get_address_receivers: jest.fn(),
  }),
);

describe("loadZaddrWasm", () => {
  const wasmResponse = () =>
    ({
      ok: true,
      status: 200,
      arrayBuffer: async () => new Uint8Array([0, 97, 115, 109]).buffer,
    }) as Response;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects HTTP error documents instead of compiling them", async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      { ok: false, status: 404 } as Response,
    );

    await expect(loadZaddrWasm(fetchMock)).rejects.toThrow(
      "WASM asset request failed (404)",
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  }, 5000);

  it("retries a transient asset failure and initializes the bindings", async () => {
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new Error("network reset"))
      .mockResolvedValueOnce(wasmResponse());
    const start = jest.fn();
    jest.spyOn(WebAssembly, "instantiate").mockResolvedValue({
      instance: { exports: { __wbindgen_start: start } },
    } as unknown as WebAssembly.WebAssemblyInstantiatedSource);

    await loadZaddrWasm(fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(start).toHaveBeenCalledTimes(1);
  }, 5000);

  it("reports an empty successful response as a load failure", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => new ArrayBuffer(0),
    } as Response);

    await expect(loadZaddrWasm(fetchMock)).rejects.toThrow("WASM asset was empty");
  }, 5000);

  it("rejects a successful HTML response before WebAssembly compilation", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => new Uint8Array([60, 104, 116, 109, 108]).buffer,
    } as Response);

    await expect(loadZaddrWasm(fetchMock)).rejects.toThrow(
      "WASM asset is not a valid WebAssembly binary",
    );
  }, 5000);
});
