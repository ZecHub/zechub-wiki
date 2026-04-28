import html2canvas from "html2canvas";
import { useRef } from "react";

export const PoolsType = {
  default: "default",
  sprout: "sprout",
  sap: "sapling",
  ord: "orchard",
};

/// This hook is used to handle the export of the dashboard chart
const useExportDashboardAsPNG = () => {
  const divChartRef = useRef<HTMLDivElement>(null);

  const handleSaveToPng = async (label: string) => {
    if (!divChartRef.current) {
      console.warn("Export failed: No chart container ref found");
      alert("Could not find chart to export. Try switching tabs and try again.");
      return;
    }

    // Small delay ensures Recharts SVG + custom components (Privacy Set, Halving Meter, etc.) are fully painted
    await new Promise((resolve) => setTimeout(resolve, 350));

    const isDark = document.documentElement.classList.contains("dark");

    try {
      console.log(`Exporting ${label} chart...`);

      const canvas = await html2canvas(divChartRef.current, {
        scale: 3,                    // High-resolution PNG
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        width: divChartRef.current.offsetWidth,
        height: divChartRef.current.offsetHeight,
        logging: false,

        // 🔥 STRONG FIX for Tailwind v4 lab()/oklab() colors
        onclone: (clonedDoc) => {
          // 1. Inject global style override with !important to neutralize ALL modern color functions
          const style = clonedDoc.createElement("style");
          style.textContent = `
            * {
              color: ${isDark ? "#e2e8f0" : "#111827"} !important;
              background-color: ${isDark ? "#0f172a" : "#ffffff"} !important;
              border-color: ${isDark ? "#334155" : "#e5e7eb"} !important;
            }
            .recharts-text,
            .recharts-label,
            text,
            .recharts-cartesian-axis-tick-value {
              fill: ${isDark ? "#e2e8f0" : "#111827"} !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          // 2. Additional cleanup for any remaining inline lab/oklab styles
          const elements = clonedDoc.querySelectorAll("*");
          elements.forEach((el) => {
            const element = el as HTMLElement;
            if (element.style.color?.includes("lab") || element.style.color?.includes("oklab")) {
              element.style.color = isDark ? "#e2e8f0" : "#111827";
            }
            if (element.style.backgroundColor?.includes("lab") || element.style.backgroundColor?.includes("oklab")) {
              element.style.backgroundColor = isDark ? "#0f172a" : "#ffffff";
            }
          });
        },
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${label.replace(/\s+/g, "-")}-zechub-chart.png`;
      link.click();

      console.log(`✅ ${label} chart exported successfully`);
    } catch (err) {
      console.error("Error saving chart:", err);
      alert("Export failed. Check console (F12) for details.");
    }
  };

  return { divChartRef, handleSaveToPng };
};

export default useExportDashboardAsPNG;