type ChartWatermarkProps = {
  label: "ZECHUB DASHBOARD";
};
const ChartWatermark = (props: ChartWatermarkProps) => {
  return (
    <div className="absolute bottom-28 right-4 text-xs shadow-sm text-slate-500 pointer-events-none select-none z-10">
      <text opacity={0.8} aria-label="Watermark">
        {props.label}
      </text>
    </div>
  );
};

export default ChartWatermark;
