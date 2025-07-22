import Button from "@/components/Button/Button";
import { ToolOptions } from "@/components/Tools/tools";
import { transformSupplyData } from "@/lib/chart/helpers";
import { PoolKey, SupplyData } from "@/lib/chart/types";

interface ExportButtonProps {
  supplies: Record<PoolKey, SupplyData | null>;
  selectedPool: PoolKey;
  selectedTool: ToolOptions;
  handleSaveToPng: (
    poolType: string,
    poolData: Record<string, { timestamp: string; supply: number } | null>,
    toolType: string
  ) => void;
}
export function ExportButton(props: ExportButtonProps) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-500">
      <Button
        text="Export PNG"
        className="bg-[#1984c7] text-white px-4 py-2 rounded-md mt-2 sm:mt-0 hover:bg-[#1675b1] transition"
        onClick={() =>
          props.handleSaveToPng(
            props.selectedPool,
            {
              sproutSupply: transformSupplyData(props.supplies.sprout),
              saplingSupply: transformSupplyData(props.supplies.sapling),
              orchardSupply: transformSupplyData(props.supplies.orchard),
            },
            props.selectedTool
          )
        }
      />
    </div>
  );
}
