import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/shadcn/card";
import { RefObject, useState } from "react";
import { ResponsiveContainer } from "recharts";
import { ErrorBoundary } from "../../ErrorBoundary/ErrorBoundary";
import CryptoMetrics from "../Metric";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../UI/shadcn/select";
import SupplyDataLastUpdated from "../LastUpdated";

type PenumbraChartProps = {
  divChartRef: RefObject<HTMLDivElement | null>;
};

function PenumbraChart(props: PenumbraChartProps) {
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [tokenIndex, setTokenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary fallback={`Failed to load Namada's chart`}>
      <div className="space-y-6">
        <CryptoMetrics selectedCoin={selectedTokenId || "Penumbra"} />

        {/* Chart Card */}
        <Card>
          <CardHeader className="flex flex-row items-center mb-12">
            <CardTitle className="flex-1">Penumbra Supply Overview:</CardTitle>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter by Token</label>
              <Select
                value={selectedTokenId}
                onValueChange={(e) => {
                  setSelectedTokenId(e);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Tokens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tokens</SelectItem>
                  {[].length > 0 &&
                    [].map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResponsiveContainer
              width="100%"
              height={400}
              className="flex items-center "
            >
              <p>Coming soon...</p>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default PenumbraChart;
