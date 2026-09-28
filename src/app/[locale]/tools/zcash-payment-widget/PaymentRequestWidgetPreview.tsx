"use client";

import { memo, useEffect, useRef } from "react";
import { config } from "./config";
import { loadZcashPaymentWidget } from "./adapters/helpers";
import { ZcashPaymentURIInstance } from "./adapters/types";

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
    zecUsdRate: number;
  };
}

function PaymentRequestWidgetPreview(props: Props) {
  const { config: cfg } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ZcashPaymentURIInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const target = `#${containerRef.current.id}`;
    let mounted = true;

    async function init() {
      try {
        await loadZcashPaymentWidget(
          config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE,
        );

        if (!mounted || !window.renderZcashButton) return;

        instanceRef.current?.destroy();

        instanceRef.current =
          (await window.renderZcashButton(target, {
            address: cfg.address,
            amount: cfg.amount,
            label: cfg.label,
            theme: cfg.theme as "light" | "dark",
            apiBase: cfg.apiBase,
            disabled: cfg.disabled,
            zecUsdRate: cfg.zecUsdRate,
            target,
          })) ?? null;
      } catch (err) {
        console.error("[Zcash Payment Widget Preview] Loading failed:", err);
      }
    }

    init();

    return () => {
      mounted = false;
      instanceRef.current?.destroy();
    };
  }, [
    cfg.address,
    cfg.amount,
    cfg.apiBase,
    cfg.disabled,
    cfg.label,
    cfg.theme,
    cfg.zecUsdRate,
  ]);

  return <div id={cfg.target.replace("#", "")} ref={containerRef}></div>;
}

export default memo(PaymentRequestWidgetPreview);
