import { ExportButton } from "./ExportButton";
import SupplyDataLastUpdated from "./LastUpdated";

type ChartFooterProps = {
  lastUpdatedDate: Date;
  handleSaveToPng: any;
  pngLabel: any;
  data?: [];
};

const ChartFooter = (props: ChartFooterProps) => {
  return (
    <>
      {props.lastUpdatedDate && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
          }}
        >
          <SupplyDataLastUpdated lastUpdated={props.lastUpdatedDate} />

          <ExportButton
            handleSaveToPng={props.handleSaveToPng}
            selectedPool={props.pngLabel}
            supplies={props.data}
            selectedTool={undefined}
          />
        </div>
      )}
    </>
  );
};

export default ChartFooter;
