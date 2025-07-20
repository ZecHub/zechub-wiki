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
import { useEffect, useState } from "react";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import CryptoMetrics from "../ShieldedPool/Metric";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/shadcn/select";

type NamadaChartProps = {
  //   selectedCrypto: string;
};

const type = {
  Date: "05/10/2025",
  Total_Supply: [
    {
      id: "Namada",
      totalSupply: "1040288568.290605",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
    {
      id: "Atom",
      totalSupply: "11267804366",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
    {
      id: "Osmo",
      totalSupply: "106107437962",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
    {
      id: "Tia",
      totalSupply: "12714514321",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
    {
      id: "Penumbra",
      totalSupply: "",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
    {
      id: "Nym",
      totalSupply: "500000",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
    {
      id: "Neutron",
      totalSupply: "1000000",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
    {
      id: "Usdc",
      totalSupply: "100000",
      shieldedSupply: "0",
      transparentSupply: "0",
    },
  ],
  Native_Supply_NAM: "1024673515.595884",
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

function NamadaChart(props: NamadaChartProps) {
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
        console.log({ list });

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
  console.log({ tokenIds });

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
        <CryptoMetrics selectedCoin={selectedTokenId || "Namada"} />

        {/* Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Namada Token Supply Overview:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
                    {tokenIds.length > 0 &&
                      tokenIds.map((token) => (
                        <SelectItem key={token} value={token}>
                          {token}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={filteredTokenData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(selectedTokenId ? [selectedTokenId] : tokenIds).map(
                  (id, index) => (
                    <Area
                      key={id}
                      type="monotone"
                      dataKey={id}
                      stackId="1"
                      stroke={`hsl(var(--chart-${(index % 6) + 1}))`}
                      fill={`hsl(var(--chart-${(index % 6) + 1}))`}
                      name={id}
                    />
                  )
                )}
              </AreaChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default NamadaChart;
