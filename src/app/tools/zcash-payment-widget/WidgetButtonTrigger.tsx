import { memo, useState } from "react";
import PaymentRequestWidgetCodeSnippet, {
  Modal,
} from "./PaymentRequestWidgetCodeSnippet";
import PaymentRequestWidgetPreview from "./PaymentRequestWidgetPreview";
import { GeneratedConfig } from "../ToolTabs";

interface Props {
  config: GeneratedConfig;
}

function WidgetButtonTrigger({ config }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-linear-to-br from-widget-light-surface dark:from-widget-dark-surface dark:to-widget-dark-bg border border-slate-600 shadow-xl">
      {/* Decorative gradient orb */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-linear-to-br from-zcash-gold/20 to-zcash-amber/10 rounded-full blur-3xl" />

      <div className="relative p-6 space-y-12">
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-500">
          <h3 className="font-semibold text-lg text-widget-light-text dark:text-widget-dark-text">
            Live Widget Demo
          </h3>
          <p className="text-xs text-widget-light-muted dark:text-widget-dark-muted mt-1">
            Click the button below to see the payment modal in action
          </p>
        </div>

        <div className={`flex justify-around mb-8`}>
          <PaymentRequestWidgetPreview
            config={{
              address: config.address,
              amount: Number(config.amount),
              label: config.label,
              apiBase: config.apiBase,
              theme: config.theme,
              target: config.target,
              disabled: config.disabled,
            }}
          />
          <div>
            <button
              disabled={config.disabled}
              className={`
                relative inline-flex items-center gap-2.5
                px-7 py-3.5
                bg-linear-to-br from-[#F4B728] to-[#E5A420]
                text-[#1a1a1a]
                text-[15px] font-semibold leading-none font-sans
                rounded-[14px] border-0
                cursor-pointer overflow-hidden
                shadow-[0_4px_24px_-4px_rgba(244,183,40,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
                transition-all duration-200 ease-in-out
                hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]`}
              onClick={() => setOpen(true)}
            >
             Preview Widget Snippet
            </button>

            <Modal isOpen={open} onClose={() => setOpen(false)}>
              <PaymentRequestWidgetCodeSnippet
                config={{
                  ...config,
                  label: config.label!,
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(WidgetButtonTrigger);
