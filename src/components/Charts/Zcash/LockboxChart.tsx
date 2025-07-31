import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
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
    <ErrorBoundary fallback={"Failed to load Lockbox Chart"}>
      <div className="space-y-6">
        <div className="flex mt-12">
          <h3 className="text-lg font-semibold mb-4 flex-1">
            Lockbox Activity
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <AreaChart data={lockboxData}>
              {/* Gradients */}
              <defs>
                <linearGradient
                  id="lockboxGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.25} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="Date" tick={{ fontSize, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize, fill: "#94a3b8" }} />
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                align="center"
                content={() => (
                  <div
                    style={{ paddingTop: 20 }}
                    className="flex justify-center gap-6 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 inline-block rounded-sm"
                        style={{ background: "hsl(var(--chart-1))" }}
                      />
                      Lockbox
                    </div>
                  </div>
                )}
              />
              <Area
                type="monotone"
                dataKey="lockbox"
                stroke="hsl(var(--chart-1))"
                fill="url(#lockboxGradient)"
                fillOpacity={1}
                strokeWidth={2}
                dot={({ index, cx, cy }) =>
                  index % 7 === 0 ? (
                    <circle
                      key={index}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="hsl(var(--chart-1))"
                      stroke="white"
                      strokeWidth={1}
                    />
                  ) : (
                    <span />
                  )
                }
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
}
