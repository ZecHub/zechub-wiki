describe("zcash-payment-widget config", () => {
  const ENV_KEYS = [
    "ACCESS_CONTROL_ALLOW_ORIGIN",
    "NEXT_PUBLIC_WIDGET_API_BASE_URL",
    "NEXT_PUBLIC_API_BASE_URL_EMBED_CODE",
  ] as const;
  const originalEnv = { ...process.env };

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
    jest.resetModules();
  });

  it("resolves an unset env var to an empty string, not the string \"undefined\"", async () => {
    for (const key of ENV_KEYS) delete process.env[key];
    jest.resetModules();

    const { config } = await import(
      "@/app/[locale]/tools/zcash-payment-widget/config"
    );

    expect(config.env.ACCESS_CONTROL_ALLOW_ORIGIN).toBe("");
    expect(config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL).toBe("");
    expect(config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE).toBe("");
  });

  it("preserves a configured env var's value unchanged", async () => {
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN = "https://zechub.wiki";
    process.env.NEXT_PUBLIC_WIDGET_API_BASE_URL = "https://zechub.wiki/api";
    process.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE =
      "https://zechub.wiki/embed.js";
    jest.resetModules();

    const { config } = await import(
      "@/app/[locale]/tools/zcash-payment-widget/config"
    );

    expect(config.env.ACCESS_CONTROL_ALLOW_ORIGIN).toBe("https://zechub.wiki");
    expect(config.env.NEXT_PUBLIC_WIDGET_API_BASE_URL).toBe(
      "https://zechub.wiki/api",
    );
    expect(config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE).toBe(
      "https://zechub.wiki/embed.js",
    );
  });
});
