"use client";

import { memo, useEffect, useRef } from "react";
import { loadZcashPaymentWidget } from "./adapters/helpers";
import { ZcashPaymentURIConfig, ZcashPaymentURIInstance } from "./adapters/types";
import { config } from "./config";

interface Props {
  config: {
    address: string;
    amount: number;
    label?: string;
    customCSS?: Record<string, string>;
    apiBase: string;
    theme: string;
    target: string;
    disabled: boolean;
    zecUsdRate:number;
  };
}

function PaymentRequestWidgetPreview(props: Props) {
  const { config: cfg } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ZcashPaymentURIInstance | null | undefined>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const target = `#${containerRef.current!.id}`;
    let mounted = true;

    async function init() {
      try {
        await loadZcashPaymentWidget(
          config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE,
        );

        if (!mounted || !window.renderZcashButton) return;

        // Destroy previouse instance
        instanceRef.current?.destroy();

        // Mount new instance
        instanceRef.current = await window.renderZcashButton(target, {
          address: cfg.address,
          amount: cfg.amount,
          label: cfg.label,
          // `Config.theme` here is a plain `string` (see the local Props
          // interface above); the widget itself falls back to "light" for
          // any unrecognized value, so this reflects existing behavior.
          theme: cfg.theme as ZcashPaymentURIConfig["theme"],
          apiBase: cfg.apiBase,
          disabled: cfg.disabled,
          zecUsdRate: cfg.zecUsdRate,
          target,
        });
      } catch (err) {
        console.error("[Zcash Payment Widget Preview] Loading failed:", err);
      }
    }

    init();

    return () => {
      mounted = false;
      instanceRef.current?.destroy();
    };
  }, [cfg]);

  return <div id={cfg.target.replace("#", "")} ref={containerRef}></div>;
}

export default memo(PaymentRequestWidgetPreview);
