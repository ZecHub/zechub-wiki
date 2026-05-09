import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  isShielded?: boolean;

  // Optional custom sizing/styles
  className?: string;
  width?: string;
  height?: string;
}

export const MetricCard = ({
  label,
  value,
  icon,
  isShielded = false,
  className = "",
  width = "w-full",
  height = "min-h-[118px] md:min-h-[128px]",
}: MetricCardProps) => (
  <div
    className={`
      group relative flex flex-col bg-slate-100 dark:bg-slate-800/50 
      border border-gray-200 dark:border-slate-700 
      rounded-xl p-5 md:p-6 shadow transition-all duration-200 
      hover:border-violet-500/50 
      hover:ring-1 hover:ring-violet-500/30 
      hover:shadow-xl hover:shadow-violet-500/10
      
      ${width}
      ${height}
      ${className}
    `}
  >
    {/* Purple accent bar */}
    <div
      className="
        absolute top-0 left-4 h-[3px] w-0 bg-violet-500 rounded-full 
        opacity-0 transition-all duration-300 ease-out
        group-hover:w-1/2 group-hover:opacity-100
      "
    />

    {/* Icon */}
    {icon && (
      <div className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 group-hover:text-violet-500 transition-colors">
        {icon}
      </div>
    )}

    <div className="flex-1 pr-8">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 tracking-tight">
        {label}
      </p>

      {isShielded ? (
        <div className="text-[15px] md:text-base font-semibold text-slate-800 dark:text-white tabular-nums leading-snug whitespace-pre-wrap">
          {value}
        </div>
      ) : (
        <p className="font-semibold text-lg md:text-xl text-slate-800 dark:text-white tabular-nums tracking-tighter">
          {value}
        </p>
      )}
    </div>
  </div>
);

interface MetricCardSkeletonProps {
  className?: string;

  width?: string;

  height?: string;
}

export const MetricCardSkeleton = ({
  className = "",

  width = "w-full",

  height = "min-h-[118px] md:min-h-[128px]",
}: MetricCardSkeletonProps) => (
  <div
    className={`

      bg-slate-100 dark:bg-slate-800/50 

      border border-gray-200 dark:border-slate-700 

      rounded-xl p-5 md:p-6 shadow animate-pulse

      

      ${width}

      ${height}

      ${className}

    `}
  >
    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-3" />

    <div className="h-7 bg-gray-300 dark:bg-slate-600 rounded w-28" />
  </div>
);
