import { useEffect, useState } from "react";

interface BlockchainInfo {
  // Interface properties...
}

interface SupplyData {
  // Interface properties...
}

// Other interfaces and functions...

async function getShieldedTxCount(): Promise<ShieldedTxCount | null> {
  try {
    const response = await fetch(shieldedTxCountUrl);
    if (!response.ok) {
      console.error("Failed to fetch shielded transaction counts");
      return null;
    }
    const data = await response.json();
    return data as ShieldedTxCount;
  } catch (error) {
    console.error("Error fetching shielded transaction counts:", error);
    return null;
  }
}

// Rest of your code...

const ShieldedPoolDashboard = () => {
  const [selectedPool, setSelectedPool] = useState("default");
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [circulation, setCirculation] = useState<number | null>(null);
  const [sproutSupply, setSproutSupply] = useState<SupplyData | null>(null);
  const [saplingSupply, setSaplingSupply] = useState<SupplyData | null>(null);
  const [orchardSupply, setOrchardSupply] = useState<SupplyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [shieldedTxCount, setShieldedTxCount] = useState<ShieldedTxCount | null>(null);

  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  useEffect(() => {
    getBlockchainData().then((data) => {
      data.nodes = 125; // Manually set the node count to 125
      setBlockchainInfo(data);
    });

    getBlockchainInfo().then((data) => setCirculation(data));

    getLastUpdatedDate().then((date) => setLastUpdated(date.split("T")[0]));

    getSupplyData(sproutUrl).then((data) => setSproutSupply(data[data.length - 1]));

    getSupplyData(saplingUrl).then((data) => setSaplingSupply(data[data.length - 1]));

    getSupplyData(orchardUrl).then((data) => setOrchardSupply(data[data.length - 1]));

    getShieldedTxCount().then((data) => setShieldedTxCount(data));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSupplyData(getDataUrl());
      setLastUpdated(data[data.length - 1].timestamp.split("T")[0]);
    };
    fetchData();
  }, [selectedPool]);

  const getDataUrl = () => {
    switch (selectedPool) {
      case "sprout":
        return sproutUrl;
      case "sapling":
        return saplingUrl;
      case "orchard":
        return orchardUrl;
      case "hashrate":
        return hashrateUrl;
      default:
        return defaultUrl;
    }
  };

  const getDataColor = () => {
    switch (selectedPool) {
      case "sprout":
        return "#A020F0";
      case "sapling":
        return "#FFA500";
      case "orchard":
        return "#32CD32";
      default:
        return "url(#area-background-gradient)";
    }
  };

  const getTotalShieldedSupply = () => {
    const totalSupply = (sproutSupply?.supply ?? 0) + (saplingSupply?.supply ?? 0) + (orchardSupply?.supply ?? 0);
    return totalSupply;
  };

  if (!blockchainInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="font-bold mt-8 mb-4">Shielded Supply Chart (ZEC)</h2>
      <div className="border p-3 rounded-lg">
        <Tools />
        <div className="relative">
          <div ref={divChartRef}>
            <ShieldedPoolChart dataUrl={getDataUrl()} color={getDataColor()} />
          </div>
        </div>
        <div className="flex justify-end gap-12 text-right mt-4 text-sm text-gray-500">
          <span className="px-3 py-2">
            Last updated:{" "}
            {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "Loading..."}
          </span>
          <Button
            text="Export (PNG)"
            className="px-3 py-2 border text-white border-slate-300 rounded-md shadow-sm bg-[#1984c7]"
            onClick={() =>
              handleSaveToPng(selectedPool, {
                sproutSupply,
                saplingSupply,
                orchardSupply,
              })
            }
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <div className="flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("default")}
              text="Total Shielded"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "default" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {getTotalShieldedSupply().toLocaleString()} ZEC
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("hashrate")}
              text="Hash Rate"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "hashrate" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("sprout")}
              text="Sprout Pool"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "sprout" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {sproutSupply ? `${sproutSupply.supply.toLocaleString()} ZEC` : "Loading..."}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("sapling")}
              text="Sapling Pool"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "sapling" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {saplingSupply ? `${saplingSupply.supply.toLocaleString()} ZEC` : "Loading..."}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => setSelectedPool("orchard")}
              text="Orchard Pool"
              className={`rounded-[0.4rem] py-2 px-4 text-white ${
                selectedPool === "orchard" ? "bg-[#1984c7]" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {orchardSupply ? `${orchardSupply.supply.toLocaleString()} ZEC` : "Loading..."}
            </span>
          </div>
        </div>
      </div>
      <HalvingMeter />
      <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Cap</h3>
          <p>${blockchainInfo.market_cap_usd.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">ZEC in Circulation</h3>
          <p>{circulation?.toLocaleString() ?? "Loading..."} ZEC</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Price (USD)</h3>
          <p>${blockchainInfo.market_price_usd.toFixed(2)}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Market Price (BTC)</h3>
          <p>{blockchainInfo.market_price_btc}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Blocks</h3>
          <p>{blockchainInfo.blocks.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">24h Transactions</h3>
          <p>{blockchainInfo.transactions_24h.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Nodes</h3>
          <p>{blockchainInfo.nodes}</p>
        </div>
        <div className="border p-4 rounded-md text-center">
          <h3 className="font-bold text-lg">Shielded TX (24h)</h3>
          <p>
            {shieldedTxCount
              ? `Sapling: ${shieldedTxCount.sapling_outputs.toLocaleString()} | Orchard: ${shieldedTxCount.orchard_outputs.toLocaleString()}`
              : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShieldedPoolDashboard;
