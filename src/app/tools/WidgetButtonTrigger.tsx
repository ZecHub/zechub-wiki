import { memo } from "react";
import PaymentRequestWidgetPreview from "./PaymentRequestWidgetPreview";
import { GeneratedConfig } from "./ToolTabs";

interface Props {
  config: GeneratedConfig ;
}

function WidgetButtonTrigger({ config }: Props) {
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

        <div className={`flex justify-center mb-16`}>
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
        </div>
      </div>
    </div>
  );
}

export default memo(WidgetButtonTrigger);
