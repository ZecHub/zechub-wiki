export const MetricCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-white dark:bg-transparent shadow-sm border border-gray-200 dark:border-slate-700 rounded-md p-4 transition hover:shadow-sm">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="font-medium text-slate-700 dark:text-white">{value}</p>
  </div>
);
  