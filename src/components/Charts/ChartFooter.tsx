import { ExportButton } from "./ExportButton";
import SupplyDataLastUpdated from "./LastUpdated";

type ChartFooterProps = {
  lastUpdatedDate: Date;
  handleSaveToPng: any;
  imgLabel: string;
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
            imgLabel={props.imgLabel}
          />
        </div>
      )}
    </>
  );
};

export default ChartFooter;
