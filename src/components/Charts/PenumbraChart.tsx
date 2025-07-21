// "use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { DATA_URL } from "@/lib/chart/data-url";
import { getNamadaSupply } from "@/lib/chart/helpers";
// import { NamadaAsset } from "@/lib/chart/types";
import { RefObject, useEffect, useState } from "react";
import { ResponsiveContainer } from "recharts";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import SupplyDataLastUpdated from "../LastUpdated";
import CryptoMetrics from "../ShieldedPool/Metric";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/shadcn/select";

type NamadaChartProps = {
  lastUpdated: Date;
  divChartRef: RefObject<HTMLDivElement | null>;
};

type NamadaAsset = {
  id: string;
  totalSupply: string;
  shieldedSupply: string;
  transparentSupply: string;
};

type NamadaRawData = {
  Date: string;
  Total_Supply: NamadaAsset[];
  Native_Supply_NAM: string;
};

function PenumbraChart(props: NamadaChartProps) {
  const [namadaAssets, setNamadaAssets] = useState<NamadaAsset[]>([]);
  const [selectedNamadaAsset, setSelectedNamadaAsset] = useState<string>("");
  const [namadaSeries, setNamadaSeries] = useState<any>();
  const [namadaRaw, setNamadaRaw] = useState<NamadaRawData[]>([]);
  const [holder, setHolder] = useState<any>({});
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [tokenIndex, setTokenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!DATA_URL?.namadaSupplyUrl) {
      alert("DATA_URL.namadaSupplyUrl is undefined on mount");
      return;
    }

    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [namadaResponse] = await Promise.all([
          getNamadaSupply(DATA_URL?.namadaSupplyUrl, controller.signal),
        ]);

        console.log({ namadaResponse });
        if (namadaResponse.length > 0) {
          setNamadaRaw(namadaResponse);
        }

        const list: NamadaAsset[] = namadaResponse[0]?.Total_Supply || [];
        if (list.length > 0) {
          setSelectedNamadaAsset(list[0].id);
        }
        setNamadaAssets(list);
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

  // Flatten Namada chart data to something usable by Recharts
  const flattenedNamadaSupply = namadaRaw.map((entry) => {
    const date = entry.Date;
    const tokens = entry.Total_Supply.reduce(
      (
        acc: { [x: string]: number },
        token: { id: string | number; totalSupply: any }
      ) => {
        acc[token.id] = parseFloat(token.totalSupply || "0");
        return acc;
      },
      {} as Record<string, number>
    );

    return { Date: date, ...tokens };
  });

  const tokenIds = Object.keys(flattenedNamadaSupply[0] || {}).filter(
    (id) => id !== "Date"
  );

  // Default: All tokens stacked
  const filteredTokenData = selectedTokenId
    ? flattenedNamadaSupply.map((row) => ({
        Date: row.Date,
        [selectedTokenId]: row[selectedTokenId],
      }))
    : flattenedNamadaSupply;

  if (loading) return <p className="w-full h-96">Loading...</p>;
  if (!namadaRaw) return <div>No data available.</div>;

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

            {props.lastUpdated && (
              <SupplyDataLastUpdated lastUpdated={props.lastUpdated} />
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default PenumbraChart;
