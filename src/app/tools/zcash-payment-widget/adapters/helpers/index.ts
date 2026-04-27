let widgetPromise: Promise<void> | null = null;

export function loadZcashPaymentUriWidget(src: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  // Loaded already
  if ((window as any).renderZcashButton) {
    return Promise.resolve();
  }

  // Currently loading
  if (widgetPromise) return widgetPromise;

  widgetPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}]`,
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());

      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = reject;

    document.body.appendChild(script);
  });

  return widgetPromise;
}
