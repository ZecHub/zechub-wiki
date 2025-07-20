import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./index.css";

// Tabs component - simple implementation
const Tabs = ({ children, defaultValue, value, onValueChange }: any) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="tabs-container">
      {children({ activeTab, setActiveTab: handleTabChange })}
    </div>
  );
};

const TabsList = ({ children }: any) => (
  <div className="flex space-x-1 rounded-lg bg-muted bg-slate-100 p-1 mb-4">
    {children}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab }: any) => (
  <button
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }: any) => (
  <div className={activeTab === value ? "block" : "hidden"}>{children}</div>
);

// Sample data for Zcash charts
const shieldedSupplyData = [
  { supply: 2530, close: "01/01/2017", year: 2017 },
  { supply: 2600, close: "01/02/2017", year: 2017 },
  { supply: 2680, close: "01/03/2017", year: 2017 },
  { supply: 2850, close: "01/04/2017", year: 2017 },
  { supply: 3780, close: "01/05/2017", year: 2017 },
  { supply: 2900, close: "01/06/2017", year: 2017 },
  { supply: 2790, close: "01/07/2017", year: 2017 },
  { supply: 3090, close: "01/08/2017", year: 2017 },
];

const orchardSupplyData = [
  { supply: 156, close: "05/31/2022", year: 2022 },
  { supply: 287, close: "06/01/2022", year: 2022 },
  { supply: 2468, close: "06/02/2022", year: 2022 },
  { supply: 3237, close: "06/03/2022", year: 2022 },
  { supply: 3242, close: "06/04/2022", year: 2022 },
  { supply: 4078, close: "06/05/2022", year: 2022 },
  { supply: 5240, close: "06/06/2022", year: 2022 },
  { supply: 5248, close: "06/07/2022", year: 2022 },
  { supply: 5699, close: "06/08/2022", year: 2022 },
];

const saplingSupplyData = [
  { supply: 1155, close: "10/29/2018", year: 2018 },
  { supply: 17192, close: "10/30/2018", year: 2018 },
  { supply: 19567, close: "10/31/2018", year: 2018 },
  { supply: 19953, close: "11/1/2018", year: 2018 },
  { supply: 22329, close: "11/2/2018", year: 2018 },
  { supply: 22993, close: "11/3/2018", year: 2018 },
  { supply: 23559, close: "11/4/2018", year: 2018 },
  { supply: 24731, close: "11/5/2018", year: 2018 },
];

const sproutSupplyData = [
  { supply: 61, close: "10/28/2016", year: 2016 },
  { supply: 58, close: "10/29/2016", year: 2016 },
  { supply: 174, close: "10/30/2016", year: 2016 },
  { supply: 296, close: "10/31/2016", year: 2016 },
  { supply: 249, close: "11/2/2016", year: 2016 },
  { supply: 203, close: "11/3/2016", year: 2016 },
  { supply: 346, close: "11/4/2016", year: 2016 },
  { supply: 231, close: "11/5/2016", year: 2016 },
  { supply: 302, close: "11/7/2016", year: 2016 },
];

const difficultyData = [
  { Date: "10/28/2016", Difficulty: 1.0 },
  { Date: "11/10/2016", Difficulty: 231440.6091337734 },
  { Date: "11/24/2016", Difficulty: 685794.4359905792 },
  { Date: "12/08/2016", Difficulty: 978573.5028480291 },
  { Date: "12/22/2016", Difficulty: 1134886.9354811532 },
  { Date: "01/05/2017", Difficulty: 1040004.6259458805 },
  { Date: "01/19/2017", Difficulty: 1068834.5144758017 },
  { Date: "02/02/2017", Difficulty: 876209.3342173713 },
];

const issuanceData = [
  {
    Date: "2019-01-01",
    "ZEC Issuance": 7200,
    "ZEC Supply": 5560800,
    "Current Inflation (%)": 47.26,
  },
  {
    Date: "2019-01-02",
    "ZEC Issuance": 7200,
    "ZEC Supply": 5568000,
    "Current Inflation (%)": 47.2,
  },
  {
    Date: "2019-01-03",
    "ZEC Issuance": 7200,
    "ZEC Supply": 5575200,
    "Current Inflation (%)": 47.14,
  },
  {
    Date: "2019-01-04",
    "ZEC Issuance": 7200,
    "ZEC Supply": 5582400,
    "Current Inflation (%)": 47.08,
  },
  {
    Date: "2019-01-05",
    "ZEC Issuance": 7200,
    "ZEC Supply": 5589600,
    "Current Inflation (%)": 47.02,
  },
];

const lockboxData = [
  { Date: "11/23/2024", lockbox: 0.1875 },
  { Date: "11/24/2024", lockbox: 216.1875 },
  { Date: "11/25/2024", lockbox: 432.1875 },
  { Date: "11/26/2024", lockbox: 648.1875 },
  { Date: "11/27/2024", lockbox: 864.1875 },
  { Date: "11/28/2024", lockbox: 1080.1875 },
  { Date: "11/29/2024", lockbox: 1296.1875 },
  { Date: "11/30/2024", lockbox: 1512.1875 },
  { Date: "12/01/2024", lockbox: 1728.1875 },
];

const netInflowData = [
  {
    Date: "2024-11-17",
    "Net Sapling Flow": 70655.9,
    "Net Orchard Flow": 297273.7,
  },
  {
    Date: "2024-11-24",
    "Net Sapling Flow": 42988.3,
    "Net Orchard Flow": -6249.9,
  },
  { Date: "2024-12-01", "Net Sapling Flow": -4982, "Net Orchard Flow": -15568 },
  { Date: "2024-12-08", "Net Sapling Flow": 11848, "Net Orchard Flow": -3828 },
  { Date: "2024-12-15", "Net Sapling Flow": 835, "Net Orchard Flow": -18126 },
  {
    Date: "2024-12-22",
    "Net Sapling Flow": -12170,
    "Net Orchard Flow": -63404,
  },
  {
    Date: "2024-12-29",
    "Net Sapling Flow": 36776,
    "Net Orchard Flow": -134778,
  },
];

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("zcash");
  const [selectedYear, setSelectedYear] = useState("all");
  const [activeTab, setActiveTab] = useState("supply");

  // Placeholder metrics data
  const metricsData = {
    marketCap: "$2.45B",
    zecInCirculation: "15.7M ZEC",
    marketPriceUSD: "$156.78",
    marketPriceBTC: "0.00321 BTC",
    blocks: "2,456,789",
    tx24hr: "12,456",
    shieldedTx24hr: "3,247",
  };

  const getAvailableYears = () => {
    const allData = [
      ...shieldedSupplyData,
      ...orchardSupplyData,
      ...saplingSupplyData,
      ...sproutSupplyData,
    ];
    const years = [...new Set(allData.map((item) => item.year))].sort();
    return ["all", ...years];
  };

  const filterDataByYear = (data: any[], year: string) => {
    if (year === "all") return data;
    return data.filter((item) => item.year === parseInt(year));
  };

  const calculateTotalSupply = (year: string) => {
    const allData = [
      ...shieldedSupplyData,
      ...orchardSupplyData,
      ...saplingSupplyData,
      ...sproutSupplyData,
    ];
    const filteredData = filterDataByYear(allData, year);
    return filteredData.reduce((sum, item) => sum + item.supply, 0);
  };

  const combinedPoolData = [
    ...filterDataByYear(shieldedSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: 0,
      sapling: 0,
      orchard: 0,
    })),
    ...filterDataByYear(sproutSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: item.supply,
      sapling: 0,
      orchard: 0,
    })),
    ...filterDataByYear(saplingSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: 0,
      sapling: item.supply,
      orchard: 0,
    })),
    ...filterDataByYear(orchardSupplyData, selectedYear).map((item) => ({
      ...item,
      sprout: 0,
      sapling: 0,
      orchard: item.supply,
    })),
  ].sort((a, b) => new Date(a.close).getTime() - new Date(b.close).getTime());

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Privacy Cryptocurrency Dashboard
            </h1>
            <p className="text-muted-foreground">
              Analyze privacy coin metrics and trends
            </p>
          </div>

          {/* Crypto Selector */}
          <div className="flex gap-2">
            <Button
              className="bg-orange-400/75 text-white"
              variant={selectedCrypto === "zcash" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("zcash")}
            >
              Zcash
            </Button>
            <Button
              className="bg-purple-500/75 text-white"
              variant={selectedCrypto === "penumbra" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("penumbra")}
              disabled
            >
              Penumbra
            </Button>
            <Button
              className="bg-yellow-300/75 text-white"
              variant={selectedCrypto === "namada" ? "default" : "outline"}
              onClick={() => setSelectedCrypto("namada")}
              disabled
            >
              Namada
            </Button>
          </div>
        </div>

        {/* Zcash Dashboard */}
        {selectedCrypto === "zcash" && (
          <div className="space-y-6">
            {/* Market Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    Market Cap
                  </div>
                  <div className="text-lg font-semibold">
                    {metricsData.marketCap}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    ZEC in Circulation
                  </div>
                  <div className="text-lg font-semibold">
                    {metricsData.zecInCirculation}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    Market Price (USD)
                  </div>
                  <div className="text-lg font-semibold">
                    {metricsData.marketPriceUSD}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    Market Price (BTC)
                  </div>
                  <div className="text-lg font-semibold">
                    {metricsData.marketPriceBTC}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    Blocks
                  </div>
                  <div className="text-lg font-semibold">
                    {metricsData.blocks}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    24hr TX
                  </div>
                  <div className="text-lg font-semibold">
                    {metricsData.tx24hr}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    Shielded TX (24hr)
                  </div>
                  <div className="text-lg font-semibold">
                    {metricsData.shieldedTx24hr}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {({ activeTab, setActiveTab }: any) => (
                    <>
                      <TabsList>
                        <TabsTrigger
                          value="supply"
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        >
                          Supply
                        </TabsTrigger>
                        <TabsTrigger
                          value="difficulty"
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        >
                          Difficulty
                        </TabsTrigger>
                        <TabsTrigger
                          value="issuance"
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        >
                          Issuance
                        </TabsTrigger>
                        <TabsTrigger
                          value="lockbox"
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        >
                          Lockbox
                        </TabsTrigger>
                        <TabsTrigger
                          value="flows"
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        >
                          Flows
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="supply" activeTab={activeTab}>
                        <div className="space-y-6">
                          <div>
                            <div className="flex">
                              <h3 className="text-lg font-semibold mb-4 flex-1">
                                Shielded Supply Overview
                              </h3>
                              <CardContent className="flex items-center flex-col lg:flex-row gap-4">
                                <div className="flex justify-center items-center gap-2">
                                  <label className="text-sm font-medium">
                                    Year
                                  </label>
                                  <Select
                                    value={selectedYear}
                                    onValueChange={setSelectedYear}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableYears().map((year) => (
                                        <SelectItem
                                          key={year}
                                          value={year.toString()}
                                        >
                                          {year === "all" ? "All" : year}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex justify-center items-center gap-2">
                                  <label className="text-sm font-medium">
                                    Total Supply
                                  </label>
                                  <Badge variant="secondary" className="w-fit">
                                    {calculateTotalSupply(
                                      selectedYear
                                    ).toLocaleString()}{" "}
                                    ZEC
                                  </Badge>
                                </div>
                              </CardContent>
                            </div>
                            <ResponsiveContainer width="100%" height={400}>
                              <AreaChart data={combinedPoolData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="close" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                  type="monotone"
                                  dataKey="sprout"
                                  stackId="1"
                                  stroke="hsl(var(--chart-1))"
                                  fill="hsl(var(--chart-1))"
                                  name="Sprout Pool"
                                />
                                <Area
                                  type="monotone"
                                  dataKey="sapling"
                                  stackId="1"
                                  stroke="hsl(var(--chart-2))"
                                  fill="hsl(var(--chart-2))"
                                  name="Sapling Pool"
                                />
                                <Area
                                  type="monotone"
                                  dataKey="orchard"
                                  stackId="1"
                                  stroke="hsl(var(--chart-3))"
                                  fill="hsl(var(--chart-3))"
                                  name="Orchard Pool"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="difficulty" activeTab={activeTab}>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Mining Difficulty
                          </h3>
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={difficultyData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="Date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="Difficulty"
                                stroke="hsl(var(--chart-4))"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>

                      <TabsContent value="issuance" activeTab={activeTab}>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            ZEC Issuance & Inflation
                          </h3>
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={issuanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="Date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="Current Inflation (%)"
                                stroke="hsl(var(--chart-5))"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>

                      <TabsContent value="lockbox" activeTab={activeTab}>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Lockbox Activity
                          </h3>
                          <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={lockboxData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="Date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="lockbox"
                                stroke="hsl(var(--chart-1))"
                                fill="hsl(var(--chart-1))"
                                fillOpacity={0.6}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>

                      <TabsContent value="flows" activeTab={activeTab}>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Net Sapling & Orchard Flow
                          </h3>
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={netInflowData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="Date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="Net Sapling Flow"
                                stroke="hsl(var(--chart-2))"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="Net Orchard Flow"
                                stroke="hsl(var(--chart-3))"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Placeholder for other cryptocurrencies */}
        {selectedCrypto !== "zcash" && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  {selectedCrypto.charAt(0).toUpperCase() +
                    selectedCrypto.slice(1)}{" "}
                  Dashboard
                </h3>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
