import React from "react";

type DefaultSelectProps<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  options: T[];
  className?: string;
  optionClassName?: string;
  renderOption?: (opt: T) => React.ReactNode;
  ariaLabel?: string;
};

/**
 * A stylable, native <select> component that avoids Radix scroll lock issues.
 * Provides optional `renderOption` for custom item rendering.
 */
export default function DefaultSelect<T extends string>({
  value,
  onChange,
  options,
  className = "",
  optionClassName = "",
  renderOption,
  ariaLabel = "Select option",
}: DefaultSelectProps<T>) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`
          w-36 text-sm py-1.5 px-3 pr-8 rounded-md
          bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
          border dark:border-slate-700 shadow-sm
          focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600
          hover:border-slate-400 dark:hover:border-slate-600
          appearance-none cursor-pointer
        `}
      >
        {options.map((opt:any) => (
          <option
            key={opt}
            value={opt}
            className={`bg-slate-50 dark:bg-slate-800 ${optionClassName}`}
          >
            {renderOption ? renderOption(opt) : opt}
          </option>
        ))}
      </select>

    </div>
  );
}
