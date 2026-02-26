import { useMemo } from "react";
import { buildFinancialChartData, buildMilestoneCompletionChartData, computeCategoryStats } from "../../lib/helpers";
import { Grant } from "../../types/grants";

type Props = {
  grants: Grant[];
};
export function ZipAndGrantsChart(props: Props) {
    const grants = props.grants;

  const stats = useMemo(() => {
    return {
      grantsStatusData: buildFinancialChartData(grants),
      categoryData: computeCategoryStats(grants),
      financialData: buildFinancialChartData(grants),
      milestoneData: buildMilestoneCompletionChartData(grants)
    };
  }, [props.grants]);

  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>;
}
