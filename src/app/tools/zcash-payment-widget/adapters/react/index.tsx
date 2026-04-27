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

  const [status, setStatue] = useState<WidgetStatus>("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    async function init() {
  
      try {
        setStatue("loading");

        await loadZcashPaymentWidget(scriptSrc);
 

        if (!mounted || !window.renderZcashButton) return;

        // Cleanup existing instance
        instanceRef.current?.destroy();

        instanceRef.current = window.renderZcashButton(
          `#${containerRef.current!.id}`,
          {
            ...props,
            target: `#${containerRef.current!.id}`,
          },
        );

        setStatue("ready");
      } catch (err: any) {
        console.error("[Zcash Payment Widget] Loading failed:", err);

        if (mounted) setStatue("error");
      }
    }

    init();

    return () => {
      mounted = false;
      instanceRef.current?.destroy();
    };
  }, [props]);

  if (status === "error") {
    return (
      <div className="fallback ">
        <p>Zcash payment widget not available.</p>
        <button
          onClick={() => {
            // Trigger retryu by force re-render
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
      {status === "loading" && <p>Loading Zcash payment widget</p>}
      <div id={`zpw-${id}`} ref={containerRef} />;
    </>
  );
}
