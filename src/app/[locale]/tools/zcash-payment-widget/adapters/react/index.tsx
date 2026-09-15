import { useEffect, useId, useRef, useState } from "react";
import { config } from "../../config";
import { loadZcashPaymentWidget, logZcashPaymentWidgetEvent } from "../helpers";
import { ZcashPaymentURIConfig, ZcashPaymentURIInstance } from "../types";

interface Props extends Omit<ZcashPaymentURIConfig, "target"> {}
type WidgetStatus = "loading" | "ready" | "error";

const scriptSrc = config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE;
export function ZcashPaymentURI(props: Props) {
  const { address, amount, zecUsdRate, label, theme, memo, apiBase, disabled } =
    props;

  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ZcashPaymentURIInstance | null | undefined>(null);
  const id = useId();

  const [status, setStatue] = useState<WidgetStatus>("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    async function init() {
      logZcashPaymentWidgetEvent("zcash_payment_widget_load_start");

      try {
        setStatue("loading");

        await loadZcashPaymentWidget(scriptSrc);
        logZcashPaymentWidgetEvent("zcash_payment_widget_loaded");

        if (!mounted || !window.renderZcashButton) return;

        // Cleanup existing instance
        instanceRef.current?.destroy();

        instanceRef.current = await window.renderZcashButton(
          `#${containerRef.current!.id}`,
          {
            address,
            amount,
            zecUsdRate,
            label,
            theme,
            memo,
            apiBase,
            disabled,
            target: `#${containerRef.current!.id}`,
          },
        );

        if (mounted) setStatue("ready");
      } catch (err) {
        // err may be `undefined` (loadZcashPaymentUriWidget's error-event
        // listener rejects with no reason) or an ErrorEvent/non-Error value
        // (script.onerror), never assume it has a `.message`.
        const message = err instanceof Error ? err.message : String(err);
        console.error("[Zcash Payment Widget] Loading failed:", err);

        try {
          logZcashPaymentWidgetEvent("zcash_payment_widget_load_failed", {
            error: message,
          });
        } catch (logErr) {
          console.error("[Zcash Payment Widget] Failed to log event:", logErr);
        }

        if (mounted) setStatue("error");
      }
    }

    init();

    return () => {
      mounted = false;
      instanceRef.current?.destroy();
    };
  }, [address, amount, zecUsdRate, label, theme, memo, apiBase, disabled]);

  if (status === "error") {
    return (
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-2xl text-foreground">Zcash payment widget not available.</p>
        <button className='border border-slate-400 rounded-md p-2 cursor-pointer w-40'
          onClick={() => {
            // Trigger retry to force re-render
            setStatue("loading");
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && <p className="text-muted-foreground">Loading Zcash payment widget...</p>}
      <div id={`zpw-${id}`} ref={containerRef} />
    </>
  );
}
