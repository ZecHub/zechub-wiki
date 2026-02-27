import {
  BarChart3,
  CheckCircle,
  Coins,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  activeGrants,
  computeCategoryStats,
  computeStats,
  disbursedOverTime,
  topGrantees,
  totalGrantees,
  zecUsdRateOverTime,
} from "../../lib/helpers";
import { Grant } from "../../types/grants";
import { Stats } from "../Stats";
import { CategoryChart } from "./grants/CategoryChart";
import { TopGranteesChart } from "./grants/TopGranteesChart";
import { USDDisbursedOverTimeChart } from "./grants/USDDisbursedOverTimeChart";
import { ZecUsdRateChart } from "./grants/ZecUsdRateChart";

type Props = {
  grants: Grant[];
};

export function ZipAndGrantsChart(props: Props) {
  const grants = props.grants;

  const data = useMemo(
    () => ({
      activeGrants: activeGrants(grants),
      totalGrantees: totalGrantees(grants),
      categoryData: computeCategoryStats(grants),
      stats: computeStats(grants),
      timeData: disbursedOverTime(grants),
      topData: topGrantees(grants),
      rateData: zecUsdRateOverTime(grants),
    }),
    [props.grants],
  );

  const statCards = [
    {
      label: "Total Grants",
      value: data.stats.totalGrants.toLocaleString(),
      icon: BarChart3,
      color: "text-primary",
    },
    {
      label: "Total USD",
      value: `$${(data.stats.totalAmountUSD / 1e6).toFixed(2)}M`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Total ZEC",
      value: data.stats.totalZec.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      icon: Coins,
      color: "hsl(170, 80%, 45%)",
    },
    {
      label: "Avg Grant",
      value: `$${(data.stats.avgGrant / 1e3).toFixed(1)}K`,
      icon: TrendingUp,
      color: "hsl(262, 80%, 60%)",
    },
    {
      label: "Completion",
      value: `${data.stats.completionRate.toFixed(0)}%`,
      icon: CheckCircle,
      color: "hsl(120, 60%, 45%)",
    },
    {
      label: "Active Grants",
      value: `${data.activeGrants}`,
      icon: TrendingUp,
      color: "hsl(262, 80%, 60%)",
    },
    {
      label: "Totals Grantees",
      value: `${data.totalGrantees}`,
      icon: Users,
      color: "hsl(50, 40%, 60%)",
    },
  ];

  return (
    <section className="">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Zcash Grants Analytics
        </h2>
      </div>

      {/* Stats  */}
      <Stats statCards={statCards} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart catData={data.categoryData} />
        <USDDisbursedOverTimeChart timeData={data.timeData} />
        <TopGranteesChart topData={data.topData} />
        <ZecUsdRateChart rateData={data.rateData} />
      </div>
    </section>
  );
}
