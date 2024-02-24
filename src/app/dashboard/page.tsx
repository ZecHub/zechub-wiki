import React, { useEffect, useState } from 'react';

async function getData() {
  const response = await fetch('https://zcashblockexplorer.com/api/v1/blockchain-info');
  const data = await response.json();

  return data as BlockchainInfo;
}

interface BlockchainInfo {
  bestblockhash: string;
  blocks: number;
  build: string;
  chain: string;
  chainSupply: {
    chainValue: number;
    chainValueZat: number;
    monitored: boolean;
  };
  chainwork: string;
  commitments: number;
  consensus: {
    chaintip: string;
    nextblock: string;
  };
  difficulty: number;
  estimatedheight: number;
  headers: number;
  initial_block_download_complete: boolean;
  pruned: boolean;
  size_on_disk: number;
  softforks: {
    enforce: {
      found: number;
      required: number;
      status: boolean;
      window: number;
    };
    id: string;
    reject: {
      found: number;
      required: number;
      status: boolean;
      window: number;
    };
    version: number;
  }[];
  upgrades: {
    [key: string]: {
      activationheight: number;
      info: string;
      name: string;
      status: string;
    };
  };
  valuePools: {
    chainValue: number;
    chainValueZat: number;
    id: string;
    monitored: boolean;
  }[];
  verificationprogress: number;
}


export default async function DashboardPage() {
  const blockchainInfo: BlockchainInfo = await getData()
  return (
    <div>
      <h2 className="font-bold mt-8">Pools</h2>
      <div className="grid grid-cols-2 gap-4">
        {blockchainInfo.valuePools.map((valuePool, index) => (
          <div key={index} className="shadow-lg p-4 rounded-md">
            <h2 className="font-bold capitalize text-lg text-blue-500  py-2">{valuePool.id} Pool</h2>
            <div className="pt-2">
              <div>
                <span className="text-sm text-gray-500 pr-2">Chain Value:</span>
                <span>{valuePool.chainValue.toLocaleString()} ZEC</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 pr-2">Chain Value Zat</span>
                <span>{valuePool.chainValueZat.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 pr-2">Monitored:</span>
                <span>{valuePool.monitored ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
      <h1>Metrics</h1>
        <table className="border-collapse border border-blue-300 w-full rounded-lg">
        <thead>
          <tr>
            <th className="border text-left border-blue-300 px-4 py-2 bg-blue-100 text-gray-500">Property</th>
              <th className="border text-left border-blue-300 px-4 py-2 bg-blue-100">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Best Block Hash</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.bestblockhash}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Blocks</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.blocks.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Build</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.build}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Chain</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.chain}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Chain Supply</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.chainSupply.chainValue.toLocaleString()} ZEC</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Chain Supply Zat</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.chainSupply.chainValueZat.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Monitored</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.chainSupply.monitored ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Chainwork</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.chainwork}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Commitments</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.commitments.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Chaintip</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.consensus.chaintip}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Next Block</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.consensus.nextblock}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Difficulty</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.difficulty.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Estimated Height</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.estimatedheight.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Headers</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.headers.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Initial Block Download Complete</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.initial_block_download_complete ? 'Yes' : "No"}</td>
          </tr>
          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Pruned</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.pruned ? 'Yes' : "No"}</td>
          </tr>
          <tr>
              <td className="border border-blue-300 px-4 py-2 text-gray-500">Size on Disk</td>
            <td className="border border-blue-300 px-4 py-2">{blockchainInfo.size_on_disk.toLocaleString()}</td>
          </tr>

          <tr>
            <td className="border border-blue-300 px-4 py-2 text-gray-500">Verification Progress</td>
            <td className="border border-blue-300 px-4 py-2">{(blockchainInfo.verificationprogress * 100).toFixed(6)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
}