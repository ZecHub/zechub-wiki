import { config } from "../../config";

let widgetPromise: Promise<void> | null = null;

export function loadZcashPaymentUriWidget(src: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  // Loaded already
  if ((window as any).renderZcashButton) {
    return Promise.resolve();
  }

  // Currently loading
  if (widgetPromise) return widgetPromise;

  const attempt = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src.replace(/["\\]/g, "\\$&")}"]`,
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => {
        existing.remove();
        reject(new Error(`Failed to load ${src}`));
      });

      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => {
      // Drop the failed tag so the next attempt inserts a fresh one.
      script.remove();
      reject(new Error(`Failed to load ${src}`));
    };

    document.body.appendChild(script);
  });

  // Cache only while loading or after success. Keeping a rejected promise
  // made every later call, including the automatic retries and the Retry
  // button, return the same failure until the page was reloaded.
  widgetPromise = attempt.catch((err) => {
    widgetPromise = null;
    throw err;
  });

  return widgetPromise;
}

async function loadWithRetry(loader: any, retries = 2, delay = 1000) {
  let lastError;

  for (let i = 0; i <= retries; i++) {
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


/**
 * A minimal telemetry hook
 * @param event 
 * @param data 
 */
export function logZcashPaymentWidgetEvent(event: string, data?: any) {
  try {
    console.log(`[ZPW] ${event}`, data);
    fetch(config.ZCASH_PAYMENT_WIDGET_EVENT_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    console.error(`[ZPW Event log]: failed!`, err);
  }
}
