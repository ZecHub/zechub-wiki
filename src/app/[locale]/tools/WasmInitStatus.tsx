interface WasmReadyProps {
  wasmReady: boolean;
  wasmError?: string | null;
  onRetry?: () => void;
  label?: string;
}
export default function WasmInitStatus(props: WasmReadyProps) {
  if (props.wasmError) {
    return (
      <div role="alert" className="space-y-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
        <p className="text-xs text-red-400">Address validation is unavailable.</p>
        {props.onRetry && (
          <button type="button" onClick={props.onRetry} className="min-h-11 rounded-md px-2 text-xs font-semibold text-[#F4B728] underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#F4B728]">
            Retry decoder
          </button>
        )}
      </div>
    );
  }
  return (
    props.wasmReady && (
      <div className="flex items-center gap-2 ml-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-mono text-emerald-400/70">
          {props.label || "WASM decoder ready"}
        </span>
      </div>
    )
  );
}
