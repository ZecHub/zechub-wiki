import { useEffect, useId, useRef } from "react";
import { config } from "../../config";
import { loadZcashPaymentUriWidget } from "../loadZcashPaymentWidget";
import { ZcashPaymentURIConfig, ZcashPaymentURIInstance } from "../types";

interface Props extends Omit<ZcashPaymentURIConfig, "target"> {}

export function ZcashPaymentURI(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ZcashPaymentURIInstance | null>(null);
  const id = useId();

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    loadZcashPaymentUriWidget(
      config.env.NEXT_PUBLIC_API_BASE_URL_EMBED_CODE,
    ).then(() => {
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
    });

    return () => {
      mounted = false;
      instanceRef.current?.destroy();
    };
  }, [
    props.address,
    props.amount,
    props.label,
    props.theme,
    props.memo,
    props.apiBase,
    props.disabled,
  ]);

  return <div id={`zpw-${id}`} ref={containerRef} />;
}
