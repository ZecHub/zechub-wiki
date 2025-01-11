import html2canvas from "html2canvas";
import { useRef } from "react";

export const PoolsType = {
  default: "default",
  sprout: "sprout",
  sap: "sapling",
  ord: "orchard",
};

/// This hook is use to handle the export of the dashboard chart
const useExportDashboardAsPNG = () => {
  const divChartRef = useRef<HTMLDivElement>(null);

  const handleSaveToPng = async (
    poolType: string,
    poolData: Record<string, { timestamp: string; supply: number } | null>,
    toolType: string
  ) => {    
    const poolQty = document.createTextNode("");

    if (poolType == PoolsType.sprout) {
      poolQty.textContent = `${poolData[
        "sproutSupply"
      ]?.supply.toLocaleString()} ZEC in Sprout Pool`;
    } else if (poolType == PoolsType.ord) {
      poolQty.textContent = `${poolData[
        "orchardSupply"
      ]?.supply.toLocaleString()} ZEC in Orchard Pool`;
    } else if (poolType == PoolsType.sap) {
      poolQty.textContent = `${poolData[
        "saplingSupply"
      ]?.supply.toLocaleString()} ZEC in Sapling Pool`;
    } else {
      poolQty.textContent = "";
    }

    const span = document.createElement("span");
    span.style.color = "#eee";
    span.style.position = "absolute";
    span.style.top = "20px";
    span.style.paddingLeft = "24px";
    span.style.zIndex = "1000";
    span.appendChild(poolQty);

    if (divChartRef.current && toolType == "supply") {
      divChartRef.current.appendChild(span);
    }

    try {
      const canvas = await html2canvas(divChartRef.current!);
      const link = document.createElement("a");

      link.href = canvas.toDataURL("image/png");
      if(toolType == 'supply') link.download = `zcash-${poolType}-pool-chart.png`;
      else link.download = `zcash-${poolType}-transaction-chart.png`;
      link.click();
      
      divChartRef.current?.removeChild(span);
    } catch (err) {
      console.error("Error saving chart: ", err);
    }
  };

  return { divChartRef, handleSaveToPng };
};

export default useExportDashboardAsPNG;
