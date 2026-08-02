import { useEffect, useState } from "react";

interface Upgrade {
  id: string;
  name: string;
  activationHeight: number;
  status: string;
  activationDate?: string;
}

type Network = "mainnet" | "testnet";

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\./g, "_")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
};

export default function NetworkUpgradesChart() {
  const [network, setNetwork] = useState<Network>("mainnet");
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchUpgrades = async (selectedNetwork: Network, isInitial = false) => {
    if (!isInitial) setIsSwitching(true);
    setError(null);

    const file =
      selectedNetwork === "mainnet"
        ? "/data/zcash/network_upgrades.json"
        : "/data/zcash/network_upgrades_testnet.json";

    try {
      const res = await fetch(file, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${selectedNetwork} data`);

      const json = await res.json();

      let parsedUpgrades: Upgrade[] = [];
      if (Array.isArray(json)) {
        parsedUpgrades = json;
      } else if (json?.upgrades && Array.isArray(json.upgrades)) {
        parsedUpgrades = json.upgrades;
        setLastUpdated(json.lastUpdated || null);
      } else {
        throw new Error("Invalid JSON structure");
      }

      setUpgrades(parsedUpgrades);
    } catch (err: any) {
      setError(err.message || `Failed to load ${selectedNetwork} upgrades`);
    } finally {
      setLoading(false);
      setIsSwitching(false);
    }
  };

  useEffect(() => {
    fetchUpgrades(network, true);
  }, []);

  const handleNetworkChange = (newNetwork: Network) => {
    if (newNetwork !== network && !isSwitching) {
      setNetwork(newNetwork);
      fetchUpgrades(newNetwork);
    }
  };

  const allActive = upgrades.length > 0 && upgrades.every((u) => u.status === "active");

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Network Upgrades
            </h3>
            {isSwitching && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-purple-600" />
                <span>Loading...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zcash {network} upgrade activation heights. See{" "}
            <a
              href="https://zechub.wiki/start-here/network-upgrades"
              className="text-purple-600 hover:underline dark:text-purple-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>{" "}
            for more info.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-sm">
          <button
            onClick={() => handleNetworkChange("mainnet")}
            disabled={isSwitching}
            className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all disabled:opacity-60 ${
              network === "mainnet"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Mainnet
          </button>
          <button
            onClick={() => handleNetworkChange("testnet")}
            disabled={isSwitching}
            className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all disabled:opacity-60 ${
              network === "testnet"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Testnet
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && upgrades.length > 0 && (
        <div
          className={`overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-opacity duration-200 ${
            isSwitching ? "opacity-60" : "opacity-100"
          }`}
        >
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Upgrade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Activation Height
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Activation Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {upgrades.map((u, index) => {
                const statusClass =
                  u.status === "active"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : u.status === "pending"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/zcash-evolution#${createSlug(u.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {u.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700 dark:text-slate-300">
                      {u.activationHeight.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {u.activationDate || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500 dark:text-slate-400">
                      {u.id}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && upgrades.length === 0 && !error && (
        <div className="text-slate-500">No upgrade data found.</div>
      )}

      {!loading && upgrades.length > 0 && (
        <div className="mt-4 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>Source: getblockchaininfo</div>
          <div>
            {allActive
              ? `All upgrades currently active on ${network}`
              : lastUpdated
              ? `Last updated: ${lastUpdated}`
              : `Status varies on ${network}`}
          </div>
        </div>
      )}
    </div>
  );
}