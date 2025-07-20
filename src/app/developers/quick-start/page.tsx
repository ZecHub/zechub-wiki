import React from "react";
import { ReactNode } from "react";
import TabsPage from "@/components/TabsPage/TabsPage";

const Zebrad = () => {
  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Table of Contents */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#installing-zcash"
                className="text-blue-500 hover:underline"
              >
                1. Installing Zebrad
              </a>
            </li>
            <li>
              <a
                href="#running-zebrad"
                className="text-blue-500 hover:underline"
              >
                2. Running zebrad
              </a>
            </li>
            <li>
              <a
                href="#connecting-lightwalletd"
                className="text-blue-500 hover:underline"
              >
                3. Connecting with lightwalletd
              </a>
            </li>
            {/* <li>
              <a
                href="#testing-testnet"
                className="text-blue-500 hover:underline"
              >
                4. Testing with Testnet
              </a>
            </li> */}
            {/* <li>
              <a href="#rpc-commands" className="text-blue-500 hover:underline">
                5. Common RPC Commands
              </a>
            </li> */}
          </ul>
        </div>

        {/* Installing Zebrad Section */}
        <section id="installing-zcash" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">1. Installing Zebrad</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">System Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Linux, macOS, or Windows</li>
              <li>At least 4GB RAM (8GB recommended)</li>
              <li>250GB free disk space for full node</li>
              <li>Stable internet connection</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Linux Installation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Linux</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">
                    Ubuntu/Debian:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`sudo apt update \ncargo install --locked zebrad`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">From Source:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`git clone https://github.com/ZcashFoundation/zebra.git \ncd zebra \ngit checkout v2.4.0 \ncargo build  --release --bin zebrad \ntarget/release/zebrad start`}
                  </pre>
                </div>
              </div>
            </div>

            {/* macOS Installation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">macOS</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Homebrew:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`curl https://sh.rustup.rs -sSf | sh \ncargo install --locked zebrad`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">
                    Manual Download:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`git clone https://github.com/ZcashFoundation/zebra.git \ncd zebra \ngit checkout v2.4.0 \ncargo build  --release --bin zebrad \ntarget/release/zebrad start`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Windows Installation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Windows</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">
                    WSL (Recommended):
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`wsl --install
# Then follow Linux instructions`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Running zebrad Section */}
        <section id="running-zebrad" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">2. Running zebrad</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Initial Setup</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600">
                  Create Configuration Directory:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                  {`zebrad generate -o ~/.config/zebrad.toml`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-green-600">
                  Create zebrad.toml:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                  {`# Basic configuration
                  
[consensus]
checkpoint_sync = true

[mempool]
eviction_memory_time = "1h"
tx_cost_limit = 80000000

[metrics]

[mining]
internal_miner = false

[network]
cache_dir = true
crawl_new_peer_interval = "1m 1s"
initial_mainnet_peers = [
    "dnsseed.z.cash:8233",
    "dnsseed.str4d.xyz:8233",
    "mainnet.seeder.zfnd.org:8233",
    "mainnet.is.yolo.money:8233",
]
initial_testnet_peers = [
    "dnsseed.testnet.z.cash:18233",
    "testnet.seeder.zfnd.org:18233",
    "testnet.is.yolo.money:18233",
]
listen_addr = "[::]:8233"
max_connections_per_ip = 1
network = "Mainnet"
peerset_initial_target_size = 25

[rpc]
listen_addr = "127.0.0.1:8232"
cookie_dir = "/home/your_username/.cache/zebra"
debug_force_finished_sync = false
enable_cookie_auth = false
parallel_cpu_threads = 0

[state]
cache_dir = "/home/your_username/.cache/zebra"
delete_old_database = true
ephemeral = false

[sync]
checkpoint_verify_concurrency_limit = 1000
download_concurrency_limit = 50
full_verify_concurrency_limit = 20
parallel_cpu_threads = 0

[tracing]
buffer_limit = 128000
force_use_color = false
use_color = true
use_journald = false`}
                </pre>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Starting zebrad</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">
                    Command Line:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`zebrad start \n# Or with specific config \nzebrad -c /path/to/zebrad.toml start`}
                  </pre>
                </div>
                {/* <div>
                  <h4 className="font-semibold text-green-600">
                    Check Status:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`zcash-cli getinfo
zcash-cli getblockchaininfo`}
                  </pre>
                </div> */}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>First run will download the entire blockchain (~250GB)</li>
                <li>Initial sync can take several hours</li>
                <li>Keep your zebrad.toml secure and private</li>
                {/* <li>Use strong RPC passwords</li>
                <li>Consider running on testnet first</li> */}
              </ul>
            </div>
          </div>
        </section>

        {/* Connecting with lightwalletd Section */}
        <section id="connecting-lightwalletd" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">
            3. Connecting with lightwalletd
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              What is lightwalletd?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              lightwalletd is a server that provides a lightweight interface to
              the Zcash blockchain, designed for mobile and desktop wallets that
              don&apos;t need to run a full node.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Installation</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">
                    Prerequisites:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`# Install Go
sudo apt install golang-go
# Or download from golang.org`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">
                    Build lightwalletd:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`git clone https://github.com/zcash/lightwalletd.git
cd lightwalletd
go build`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Configuration</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Basic Setup:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`# Create config file
cat > lightwalletd.conf << EOF
zebrad-rpcuser=your_rpc_username
zebrad-rpcpass=your_rpc_password
zebrad-rpcbind=127.0.0.1
zebrad-rpcport=8232
grpc-bind-addr=127.0.0.1:9067
log-file=lightwalletd.log
EOF`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">
                    Run lightwalletd:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`./lightwalletd --config-file=lightwalletd.conf`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="bg-blue-50 dark:bg-blue-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ready to Build?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Explore the{" "}
                  <a
                    href="https://zebra.zfnd.org/index.html"
                    className="text-blue-500 hover:underline"
                  >
                    official documentation
                  </a>
                </li>
                <li>
                  Join the{" "}
                  <a
                    href="https://discord.gg/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Discord
                  </a>{" "}
                  community
                </li>
                <li>
                  Check out{" "}
                  <a
                    href="https://github.com/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub repositories
                  </a>
                </li>
                <li>
                  Read the{" "}
                  <a
                    href="https://zips.z.cash/"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Improvement Proposals (ZIPs)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Visit the{" "}
                  <a
                    href="https://forum.zcashcommunity.com/"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Community Forum
                  </a>
                </li>
                <li>
                  Check{" "}
                  <a
                    href="https://github.com/zcash/zcash/issues"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub Issues
                  </a>
                </li>
                <li>
                  Read the{" "}
                  <a
                    href="https://zcash.readthedocs.io/en/latest/rtd_pages/troubleshooting.html"
                    className="text-blue-500 hover:underline"
                  >
                    Troubleshooting Guide
                  </a>
                </li>
                <li>
                  Ask questions on{" "}
                  <a
                    href="https://stackoverflow.com/questions/tagged/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    Stack Overflow
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const Zainod = () => {
  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Installing zainod Section */}

        {/* Installing Zaino Section */}
        <section id="installing-zaino" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">1. Installing Zaino</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">What is Zaino?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Zaino is an indexer for the Zcash blockchain implemented in Rust.
              Zaino provides all necessary functionality for &quot;light&quot;
              clients (wallets and other applications that don&apos;t rely on
              the complete history of blockchain) and &quot;full&quot; clients /
              wallets and block explorers providing access to both the finalized
              chain and the non-finalized best chain and mempool held by either
              a Zebra or Zcashd full validator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Installation</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Build Zaino:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`git clone https://github.com/zingolabs/zaino.git \ncd zaino \ncargo build --release \nPATH-$PATH:~/zaino/target/release/`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">
                    Zaino Configuration:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`cd ~/zaino/zainod \nsudo nano zindexer.toml #Adjust port to 8232 for mainnet`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Configuration</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Basic Setup:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`# Configuration for Zaino

# Sets the TcpIngestor's status (true or false)
tcp_active = true

# Optional TcpIngestors listen port (use None or specify a port number
listen_port = 8137

# LightWalletD listen port [DEPRECATED]
lightwalletd_port = 9067

# Full node / validator listen port
zebrad_ port = 8232

# Optional full node Username
node_user = "xxxxxx"

# Optional full node Password
node_password = "xxxxxx"

# Maximum requests allowed in the request queue
max_queue_size = 1024

# Maximum workers allowed in the worker pool
max_worker_pool_size = 64

# Minimum number of workers held in the worker pool when idle
idle_worker_pool_size = 4`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Run zainod:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`zainod --config zindexer.toml`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="bg-blue-50 dark:bg-blue-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ready to Build?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Explore the{" "}
                  <a
                    href="https://zebra.zfnd.org/index.html"
                    className="text-blue-500 hover:underline"
                  >
                    official documentation
                  </a>
                </li>
                <li>
                  Join the{" "}
                  <a
                    href="https://discord.gg/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Discord
                  </a>{" "}
                  community
                </li>
                <li>
                  Check out{" "}
                  <a
                    href="https://github.com/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub repositories
                  </a>
                </li>
                <li>
                  Read the{" "}
                  <a
                    href="https://zips.z.cash/"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Improvement Proposals (ZIPs)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Visit the{" "}
                  <a
                    href="https://forum.zcashcommunity.com/"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Community Forum
                  </a>
                </li>
                <li>
                  Check{" "}
                  <a
                    href="https://github.com/zcash/zcash/issues"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub Issues
                  </a>
                </li>
                <li>
                  Read the{" "}
                  <a
                    href="https://zcash.readthedocs.io/en/latest/rtd_pages/troubleshooting.html"
                    className="text-blue-500 hover:underline"
                  >
                    Troubleshooting Guide
                  </a>
                </li>
                <li>
                  Ask questions on{" "}
                  <a
                    href="https://stackoverflow.com/questions/tagged/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    Stack Overflow
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const ZingoLib = () => {
  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Installing zingo Section */}

        {/* Installing zingo Section */}
        <section id="installing-zingo" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">1. Installing Zingo CLI</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">What is Zingo CLI?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Zingo-cli is a command line lightwalletd-proxy client. To use it,
              see &quot;compiling from source&quot; below. Releases are
              currently only provisional, we will update the README as releases
              come out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Installation</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">
                    Build Zingo CLI:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`git clone https://github.com/zingolabs/zingolib.git \ncd zingolib \ncargo build --release --package zingo-cli`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Configuration</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">
                    Run Zingo CLI:
                  </h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {`cd ~/zingolib/target \n./zingo-cli --server http://127.0.0.1:8137 --data-dir /path/to/your/zaino/data \n(note: this will need to fully sync, Just like lightwalletd did)`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="bg-blue-50 dark:bg-blue-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ready to Build?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Explore the{" "}
                  <a
                    href="https://zebra.zfnd.org/index.html"
                    className="text-blue-500 hover:underline"
                  >
                    official documentation
                  </a>
                </li>
                <li>
                  Join the{" "}
                  <a
                    href="https://discord.gg/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Discord
                  </a>{" "}
                  community
                </li>
                <li>
                  Check out{" "}
                  <a
                    href="https://github.com/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub repositories
                  </a>
                </li>
                <li>
                  Read the{" "}
                  <a
                    href="https://zips.z.cash/"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Improvement Proposals (ZIPs)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Visit the{" "}
                  <a
                    href="https://forum.zcashcommunity.com/"
                    className="text-blue-500 hover:underline"
                  >
                    Zcash Community Forum
                  </a>
                </li>
                <li>
                  Check{" "}
                  <a
                    href="https://github.com/zcash/zcash/issues"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub Issues
                  </a>
                </li>
                <li>
                  Read the{" "}
                  <a
                    href="https://zcash.readthedocs.io/en/latest/rtd_pages/troubleshooting.html"
                    className="text-blue-500 hover:underline"
                  >
                    Troubleshooting Guide
                  </a>
                </li>
                <li>
                  Ask questions on{" "}
                  <a
                    href="https://stackoverflow.com/questions/tagged/zcash"
                    className="text-blue-500 hover:underline"
                  >
                    Stack Overflow
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default function QuickStartPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-[40vh] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Zcash Dev Quick Start
          </h1>
          <p className="text-xl md:text-2xl">
            Get up and running with Zcash development in minutes
          </p>
        </div>
      </div>

      <TabsPage
        titles={["Zebrad", "Zaino", "Zingolib"]}
        components={[
          <Zebrad key="zebrad" />,
          <Zainod key="zainod" />,
          <ZingoLib key="zingolib" />,
        ]}
      />
    </>
  );
}
