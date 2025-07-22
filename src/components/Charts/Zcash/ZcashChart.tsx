import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { DATA_URL } from "@/lib/chart/data-url";
import {
  getBlockchainData,
  getBlockchainInfo,
  getDifficultyData,
  getLockboxData,
  getNetInOutflowData,
  getNodeCountData,
  getShieldedTxCount,
  getSupplyData,
} from "@/lib/chart/helpers";
// import { NamadaAsset } from "@/lib/chart/types";
import {
  BlockchainInfo,
  Difficulty,
  IssuanceParsed,
  LockBox,
  NetInOutflow,
  ShieldedTxCount,
  SupplyData,
} from "@/lib/chart/types";
import { RefObject, useEffect, useState } from "react";
import { ErrorBoundary } from "../../ErrorBoundary/ErrorBoundary";
import SupplyDataLastUpdated from "../../LastUpdated";
import { ZcashMetrics } from "../../ZcashMetrics/ZcashMetrics";
import DifficultyChart from "./DifficultyChart";
import IssuanceChart from "./IssuanceChart";
import LockboxChart from "./LockboxChart";
import NetInflowsOutflowsChart from "./NetInflowsOutflowsChart";
import ShieldedSupplyChart from "./ShieldedSupplyChart";

type ZcashChartProps = {
  lastUpdated: Date;
  divChartRef: RefObject<HTMLDivElement | null>;
  handleSaveToPng: (
    poolType: string,
    poolData: Record<
      string,
      {
        timestamp: string;
        supply: number;
      } | null
    >,
    toolType: string
  ) => Promise<void>;
};

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

function ZcashChart(props: ZcashChartProps) {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [activeTab, setActiveTab] = useState("supply");

  const [cumulativeCheck, setCumulativeCheck] = useState(true);
  const [filterSpamCheck, setFilterSpamCheck] = useState(false);
  const [circulation, setCirculation] = useState<number | null>(null);

  const [latestNodeCount, setLatestNodeCount] = useState<number | null>(null);
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>();
  const [blockchainData, setBlockchainData] = useState<number | null>(null);

  const [shieldedSupplyData, setShieldedSupplyData] = useState<SupplyData[]>(
    []
  );
  const [orchardSupplyData, setOrchardSupplyData] = useState<SupplyData[]>([]);
  const [saplingSupplyData, setSaplingSupplyData] = useState<SupplyData[]>([]);
  const [sproutSupplyData, setSproutSupplyData] = useState<SupplyData[]>([]);
  const [issuanceData, setIssuanceData] = useState<IssuanceParsed[]>([]);
  const [lockboxData, setLockboxData] = useState<LockBox[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty[]>([]);
  const [netInOutflowData, setNetInOutflowData] = useState<NetInOutflow[]>([]);
  const [shieldedTxCount, setShieldedTxCount] = useState<
    ShieldedTxCount[] | null
  >([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllData = async () => {
      setLoading(true);

      try {
        const [
          blockchainData,
          blockchainInfoData,
          defaultSupply,
          sproutSupply,
          saplingSupply,
          orchardSupply,
          shieldedTxCount,
          nodeCountData,
          lockboxData,
          netInOutflow,
          difficultyData,
          // issuanceData,
        ] = await Promise.all([
          // fetchShieldedSupplyData(DATA_URL.shieldedTxCountUrl, controller.signal),
          getBlockchainData(DATA_URL.blockchairUrl, controller.signal),
          getBlockchainInfo(DATA_URL.blockchainInfoUrl, controller.signal),
          getSupplyData(DATA_URL.defaultUrl, controller.signal),
          getSupplyData(DATA_URL.sproutUrl, controller.signal),
          getSupplyData(DATA_URL.saplingUrl, controller.signal),
          getSupplyData(DATA_URL.orchardUrl, controller.signal),
          getShieldedTxCount(DATA_URL.shieldedTxCountUrl, controller.signal),
          getNodeCountData(DATA_URL.nodecountUrl, controller.signal),
          getLockboxData(DATA_URL.lockboxUrl, controller.signal),
          getNetInOutflowData(
            DATA_URL.netInflowsOutflowsUrl,
            controller.signal
          ),
          getDifficultyData(DATA_URL.difficultyUrl, controller.signal),
          // getIssuanceData(DATA_URL.issuanceUrl, controller.signal),
        ]);

        if (netInOutflow) {
          setNetInOutflowData(netInOutflow);
        }
        if (lockboxData) {
          setLockboxData(lockboxData);
        }
        if (difficultyData) {
          setDifficulty(difficultyData);
        }
        if (issuanceData) {
          setIssuanceData(issuanceData);
        }

        if (blockchainInfo) {
          setBlockchainInfo(blockchainInfo);
        }
        if (sproutSupply) {
          setSproutSupplyData(sproutSupply);
        }
        if (shieldedTxCount) {
          setShieldedTxCount(shieldedTxCount);
        }
        if (saplingSupply) {
          setSaplingSupplyData(saplingSupplyData);
        }
        if (orchardSupply) {
          setOrchardSupplyData(orchardSupplyData);
        }
        if (blockchainInfoData) {
          setCirculation(blockchainInfoData);
        }

        if (nodeCountData?.length) {
          const latest = Number(
            nodeCountData[nodeCountData.length - 1].nodecount
          );
          setLatestNodeCount(latest);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchAllData();

    return () => {
      controller.abort();
    };
  }, []);

  const getAvailableYears = () => {
    const allData = [
      ...shieldedSupplyData,
      ...orchardSupplyData,
      ...saplingSupplyData,
      ...sproutSupplyData,
    ];

    const years = [
      ...new Set(
        allData.map((item) => {
          const year = extractYear(item.close);
          return year;
        })
      ),
    ].sort();

    return ["all", ...years];
  };

  const extractYear = (date: string) => {
    const [, , year] = date.split("/");
    return year;
  };

  const filterDataByYear = (data: any[], year: string) => {
    if (year === "all") return data;

    return data.filter(
      (item) => parseInt(extractYear(item.close)) === parseInt(year)
    );
  };

  const calculateTotalSupply = (year: string) => {
    const allData = [
      ...shieldedSupplyData,
      ...orchardSupplyData,
      ...saplingSupplyData,
      ...sproutSupplyData,
    ];

    const filteredData = filterDataByYear(allData, year);

    const totalSum = filteredData.reduce((sum, item) => sum + item.supply, 0);
    return totalSum;
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

  const tabLabels = ["Supply", "Difficulty", "Issuance", "Lockbox", "Flows"];
  return (
    <ErrorBoundary fallback={`Failed to load Namada's chart`}>
      <div className="space-y-6">
        {/* Market Metrics */}
        <ZcashMetrics
          blockchainInfo={blockchainInfo!}
          circulation={circulation!}
          shieldedTxCount={shieldedTxCount || []}
        />

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
                    {tabLabels.map((label) => (
                      <TabsTrigger
                        key={label}
                        value={label.toLowerCase()}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      >
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent
                    value="supply"
                    activeTab={activeTab}
                    ref={props.divChartRef}
                  >
                    <ShieldedSupplyChart
                      calculateTotalSupply={calculateTotalSupply}
                      combinedPoolData={combinedPoolData}
                      difficulty={difficulty}
                      getAvailableYears={getAvailableYears}
                      loading={loading}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                    />
                  </TabsContent>

                  <TabsContent value="difficulty" activeTab={activeTab}>
                    <DifficultyChart difficulty={difficulty} />
                  </TabsContent>

                  <TabsContent value="issuance" activeTab={activeTab}>
                    {activeTab === "issuance" && (
                      <IssuanceChart url={DATA_URL.issuanceUrl} />
                    )}
                  </TabsContent>

                  <TabsContent value="lockbox" activeTab={activeTab}>
                    <LockboxChart lockboxData={lockboxData} />
                  </TabsContent>

                  <TabsContent value="flows" activeTab={activeTab}>
                    {/* <NetFlowChart netInOutflowData={netInOutflowData} /> */}
                    <NetInflowsOutflowsChart
                      color="red"
                      dataUrl={DATA_URL.netInflowsOutflowsUrl}
                    />
                  </TabsContent>

                  <div>
                    {props.lastUpdated && (
                      <SupplyDataLastUpdated lastUpdated={props.lastUpdated} />
                    )}
                    {/* <ExportButton
                      handleSaveToPng={props.handleSaveToPng}
                      selectedPool={selectedPool}
                      selectedTool={selectedTool}
                      supplies={supplies}
                    /> */}
                  </div>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default ZcashChart;
