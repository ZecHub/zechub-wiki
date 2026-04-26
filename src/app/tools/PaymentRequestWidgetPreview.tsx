"use client";

import { memo, useEffect, useRef, useState } from "react";
import { config } from "./config";
import PaymentRequestWidgetCodeSnippet, {
  Modal,
} from "./PaymentRequestWidgetCodeSnippet";

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
  const [open, setOpen] = useState(false);

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
    <div className="flex gap-6">
      {/* required container for the embed script */}
      <div id={target} ref={containerRef}></div>
      
      <button
        disabled={cfg.disabled}
        className={`px-6 text-black rounded-xl font-semibold text-widget-dark-bg bg-linear-to-r from-[#F4B728] to-[#d9a520] shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer`}
        onClick={() => setOpen(true)}
      >
        Preview Code Snippet
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <PaymentRequestWidgetCodeSnippet
          config={{
            ...cfg,
            label: cfg.label!,
          }}
        />
      </Modal>
    </div>
  );
}

export default memo(PaymentRequestWidgetPreview);
