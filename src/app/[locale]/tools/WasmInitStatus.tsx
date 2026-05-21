interface WasmReadyProps {
  wasmReady: boolean;
  label?: string;
}
export default function WasmInitStatus(props: WasmReadyProps) {
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
