import { useEffect, useId, useRef, useState } from "react";
import { config } from "../../config";
import { loadZcashPaymentWidget, logZcashPaymentWidgetEvent } from "../helpers";
import { ZcashPaymentURIConfig, ZcashPaymentURIInstance } from "../types";

interface Props extends Omit<ZcashPaymentURIConfig, "target"> {}
type WidgetStatus = "loading" | "ready" | "error";

const scriptSrc = config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE;

export function ZcashPaymentURI(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ZcashPaymentURIInstance | null>(null);
  const id = useId();

  const [status, setStatus] = useState<WidgetStatus>("loading");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    async function init() {
      logZcashPaymentWidgetEvent("zcash_payment_widget_load_start", {
        scriptSrc,
      });

      try {
        setStatus("loading");

        await loadZcashPaymentWidget(scriptSrc);

        if (!mounted) return;

        if (!window.renderZcashButton) {
          throw new Error("renderZcashButton is not available");
        }

        instanceRef.current?.destroy();

        instanceRef.current =
          (await window.renderZcashButton(
            `#${containerRef.current!.id}`,
            {
              ...props,
              target: `#${containerRef.current!.id}`,
            },
          )) ?? null;

        if (mounted) setStatus("ready");
        logZcashPaymentWidgetEvent("zcash_payment_widget_loaded");
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[Zcash Payment Widget] Loading failed:", err);

        try {
          logZcashPaymentWidgetEvent("zcash_payment_widget_load_failed", {
            error: message,
            scriptSrc,
          });
        } catch (logErr) {
          console.error("[Zcash Payment Widget] Failed to log event:", logErr);
        }

        if (mounted) setStatus("error");
      }
    }

    init();

    return () => {
      mounted = false;
      instanceRef.current?.destroy();
    };
  }, [
    props.address,
    props.amount,
    props.apiBase,
    props.disabled,
    props.label,
    props.memo,
    props.theme,
    props.zecUsdRate,
    retryKey,
  ]);

  if (status === "error") {
    return (
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-2xl text-foreground">
          Zcash payment widget not available.
        </p>
        <button
          className="border border-slate-400 rounded-md p-2 cursor-pointer w-40"
          onClick={() => {
            setStatus("loading");
            setRetryKey((key) => key + 1);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <p className="text-muted-foreground">Loading Zcash payment widget...</p>
      )}
      <div id={`zpw-${id}`} ref={containerRef} />
    </>
  );
}
