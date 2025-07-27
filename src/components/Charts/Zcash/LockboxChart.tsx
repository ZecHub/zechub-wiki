import { useResponsiveFontSize } from "@/hooks/useResponsiveFontSize";
import { DATA_URL } from "@/lib/chart/data-url";
import { getLockboxData } from "@/lib/chart/helpers";
import { LockBox } from "@/lib/chart/types";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LockboxChartProps = {
  // lockboxData: LockBox[];
};
export default function LockboxChart(props: LockboxChartProps) {
  const [loading, setLoading] = useState(false);
  const [lockboxData, setLockboxData] = useState<LockBox[]>([]);
  const fontSize = useResponsiveFontSize(); // optional: pass min/max

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [lockboxData] = await Promise.all([
          getLockboxData(DATA_URL.lockboxUrl, controller.signal),
        ]);

        if (lockboxData) {
          setLockboxData(lockboxData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex mt-12">
        <h3 className="text-lg font-semibold mb-4 flex-1">Lockbox Activity</h3>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <AreaChart data={lockboxData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="Date" tick={{ fontSize, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="lockbox"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.6}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
