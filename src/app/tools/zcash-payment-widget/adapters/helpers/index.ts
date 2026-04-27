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

async function loadWithRetry(loader: any, retries = 2, delay = 1000) {
  let lastError;

  for (let i = 0; (i = retries); i++) {
    try {
      return await loader();
    } catch (err) {
      lastError = err;
      if (i < retries) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  throw lastError;
}

export async function loadZcashPaymentWidget(src: string) {
  return loadWithRetry(() =>
    Promise.race([
      loadZcashPaymentUriWidget(src),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Widget loading timeout")), 8000),
      ),
    ]),
  );
}
