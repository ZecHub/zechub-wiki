import React from "react";

export default function QuickStartPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-[40vh] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Zcash Dev Quick Start</h1>
          <p className="text-xl md:text-2xl">Get up and running with Zcash development in minutes</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Table of Contents */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <li><a href="#installing-zcash" className="text-blue-500 hover:underline">1. Installing Zcash</a></li>
            <li><a href="#running-zcashd" className="text-blue-500 hover:underline">2. Running zcashd</a></li>
            <li><a href="#connecting-lightwalletd" className="text-blue-500 hover:underline">3. Connecting with lightwalletd</a></li>
            <li><a href="#testing-testnet" className="text-blue-500 hover:underline">4. Testing with Testnet</a></li>
            <li><a href="#rpc-commands" className="text-blue-500 hover:underline">5. Common RPC Commands</a></li>
          </ul>
        </div>

        {/* Installing Zcash Section */}
        <section id="installing-zcash" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">1. Installing Zcash</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">System Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Linux, macOS, or Windows</li>
              <li>At least 4GB RAM (8GB recommended)</li>
              <li>50GB free disk space for full node</li>
              <li>Stable internet connection</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Linux Installation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Linux</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Ubuntu/Debian:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`sudo apt update
sudo apt install zcash`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">From Source:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`git clone https://github.com/zcash/zcash.git
cd zcash
./zcutil/build.sh`}
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
{`brew install zcash`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Manual Download:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download from <a href="https://z.cash/downloads/" className="text-blue-500 hover:underline">z.cash/downloads</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Windows Installation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Windows</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Download:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download installer from <a href="https://z.cash/downloads/" className="text-blue-500 hover:underline">z.cash/downloads</a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">WSL (Recommended):</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`wsl --install
# Then follow Linux instructions`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Running zcashd Section */}
        <section id="running-zcashd" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">2. Running zcashd</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Initial Setup</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600">Create Configuration Directory:</h4>
                <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`mkdir ~/.zcash
# Windows: mkdir %APPDATA%\\Zcash`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-600">Create zcash.conf:</h4>
                <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`# Basic configuration
rpcuser=your_rpc_username
rpcpassword=your_secure_password
rpcallowip=127.0.0.1
rpcport=8232
server=1
daemon=1
txindex=1
listen=1`}
                </pre>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Starting zcashd</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Command Line:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcashd
# Or with specific config
zcashd -conf=/path/to/zcash.conf`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Check Status:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getinfo
zcash-cli getblockchaininfo`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>First run will download the entire blockchain (~50GB)</li>
                <li>Initial sync can take several hours</li>
                <li>Keep your zcash.conf secure and private</li>
                <li>Use strong RPC passwords</li>
                <li>Consider running on testnet first</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Connecting with lightwalletd Section */}
        <section id="connecting-lightwalletd" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">3. Connecting with lightwalletd</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">What is lightwalletd?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              lightwalletd is a server that provides a lightweight interface to the Zcash blockchain, 
              designed for mobile and desktop wallets that don't need to run a full node.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Installation</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Prerequisites:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`# Install Go
sudo apt install golang-go
# Or download from golang.org`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Build lightwalletd:</h4>
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
zcashd-rpcuser=your_rpc_username
zcashd-rpcpass=your_rpc_password
zcashd-rpcbind=127.0.0.1
zcashd-rpcport=8232
grpc-bind-addr=127.0.0.1:9067
log-file=lightwalletd.log
EOF`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Run lightwalletd:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`./lightwalletd --config-file=lightwalletd.conf`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testing with Testnet Section */}
        <section id="testing-testnet" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">4. Testing with Testnet</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Why Use Testnet?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Free test ZEC for development</li>
              <li>No risk of losing real funds</li>
              <li>Faster block times for testing</li>
              <li>Perfect for learning and experimentation</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Testnet Configuration</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">zcash.conf for Testnet:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`# Testnet configuration
testnet=1
rpcuser=your_rpc_username
rpcpassword=your_rpc_password
rpcallowip=127.0.0.1
rpcport=18232
server=1
daemon=1
txindex=1`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Start Testnet Node:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcashd -testnet
# Or with config file
zcashd -testnet -conf=~/.zcash/zcash.conf`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Getting Test ZEC</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Testnet Faucet:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visit <a href="https://faucet.testnet.z.cash/" className="text-blue-500 hover:underline">faucet.testnet.z.cash</a> to get free test ZEC
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Generate Address:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`# Generate testnet address
zcash-cli -testnet getnewaddress`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Check Balance:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`# Check testnet balance
zcash-cli -testnet getbalance`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common RPC Commands Section */}
        <section id="rpc-commands" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">5. Common RPC Commands</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Node Information</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Get Node Info:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getinfo
zcash-cli getblockchaininfo
zcash-cli getnetworkinfo`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Connection Status:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getconnectioncount
zcash-cli getpeerinfo`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Wallet Operations</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Address Management:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getnewaddress
zcash-cli listaddresses
zcash-cli getaddressesbyaccount ""`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Balance & Transactions:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getbalance
zcash-cli listtransactions
zcash-cli gettransaction <txid>`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Blockchain Data</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Block Information:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getblockcount
zcash-cli getblockhash <height>
zcash-cli getblock <hash>`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Mempool:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getmempoolinfo
zcash-cli getrawmempool`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Advanced Commands</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-600">Mining:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli getmininginfo
zcash-cli getblocktemplate`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Debugging:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
{`zcash-cli help
zcash-cli help <command>
zcash-cli getmemoryinfo`}
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
                <li>Explore the <a href="https://zcash.readthedocs.io/" className="text-blue-500 hover:underline">official documentation</a></li>
                <li>Join the <a href="https://discord.gg/zcash" className="text-blue-500 hover:underline">Zcash Discord</a> community</li>
                <li>Check out <a href="https://github.com/zcash" className="text-blue-500 hover:underline">GitHub repositories</a></li>
                <li>Read the <a href="https://zips.z.cash/" className="text-blue-500 hover:underline">Zcash Improvement Proposals (ZIPs)</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Visit the <a href="https://forum.zcashcommunity.com/" className="text-blue-500 hover:underline">Zcash Community Forum</a></li>
                <li>Check <a href="https://github.com/zcash/zcash/issues" className="text-blue-500 hover:underline">GitHub Issues</a></li>
                <li>Read the <a href="https://zcash.readthedocs.io/en/latest/rtd_pages/troubleshooting.html" className="text-blue-500 hover:underline">Troubleshooting Guide</a></li>
                <li>Ask questions on <a href="https://stackoverflow.com/questions/tagged/zcash" className="text-blue-500 hover:underline">Stack Overflow</a></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 