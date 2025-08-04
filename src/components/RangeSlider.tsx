import React from "react";

type RangeSliderProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
  step?: number;
  widthClass?: string;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  step = 1,
  widthClass = "w-32", // Tailwind width default
}) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      {label && (
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {label} ({value})
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${widthClass} h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-sky-600 dark:accent-cyan-400`}
      />
      {/* Custom thumb styling */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: #0ea5e9; /* sky-500 */
          cursor: pointer;
          border: none;
          margin-top: -5px;
        }

        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: #0ea5e9;
          cursor: pointer;
          border: none;
        }

        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.4);
        }
      `}</style>
    </div>
  );
};

export default RangeSlider;
