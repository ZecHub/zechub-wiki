export const MetricCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-slate-100 dark:bg-transparent shadow-sm border border-gray-200 dark:border-slate-700 rounded-md p-4 transition hover:shadow-sm">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="font-medium text-slate-700 dark:text-white">{value}</p>
  </div>
);
  

export const MetricCardSkeleton = () => (
  <div className="bg-white dark:bg-transparent shadow-sm border border-gray-200 dark:border-slate-700 rounded-md p-4 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2" />
    <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-32" />
  </div>
);
