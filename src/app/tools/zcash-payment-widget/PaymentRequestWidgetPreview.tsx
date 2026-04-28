"use client";

import { memo, useEffect, useRef } from "react";
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
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const target = `#${containerRef.current!.id}`;
    let mounted = true;

    async function init() {
      // Load script if not present
      if (!window.renderZcashButton) {
        await new Promise<void>((resolve, reject) => {
          // create new script
          const script = document.createElement("script");
          script.src = config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE;
          script.async = true;

          script.onload = () => resolve();
          script.onerror = reject;

          document.body.appendChild(script);
        });
      }

      if (!mounted || !window.renderZcashButton) return;

      // Destroy previouse instance
      instanceRef.current?.destroy();

      // Mount new instance
      instanceRef.current = await window.renderZcashButton(target, {
        address: cfg.address,
        amount: cfg.amount,
        label: cfg.label,
        theme: cfg.theme,
        apiBase: cfg.apiBase,
        disabled: cfg.disabled,
        zecUsdRate: cfg.zecUsdRate,
        target,
      });
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
