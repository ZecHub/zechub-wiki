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
  };
}

function PaymentRequestWidgetPreview(props: Props) {
  const { config: cfg } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const target = cfg.target.replace("#", "");

  useEffect(() => {
    if (!containerRef.current) return;

    // clear previous mount;
    containerRef.current.innerHTML = "";

    // remove previous script
    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    // create new script
    const script = document.createElement("script");
    script.src = config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE;
    script.async = true;

    // required deterministic widget mount container
    script.setAttribute("data-target", cfg.target);

    script.setAttribute("data-address", cfg.address);
    script.setAttribute("data-amount", cfg.amount.toString());
    script.setAttribute("data-label", cfg.label!);
    script.setAttribute("data-theme", cfg.theme);
    script.setAttribute("data-api-base", cfg.apiBase);
    script.setAttribute("data-disabled", String(cfg.disabled));

    scriptRef.current = script;

    containerRef.current.appendChild(script);
  }, [cfg]);

  return (
    <>
      {/* required container for the embed script */}
      <div id={target} ref={containerRef}></div>
    </>
  );
}

export default memo(PaymentRequestWidgetPreview);
