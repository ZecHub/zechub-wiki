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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {blockchainInfo.valuePools.map((valuePool, index) => (
          <div key={index} className="shadow-lg p-4 rounded-md">
            <h2 className="font-bold capitalize text-lg text-blue-500  py-2">{valuePool.id} Pool</h2>
            <div className="pt-2">
              <div>
                <span className="text-sm text-gray-500 pr-2">Chain Value:</span>
                <span>{valuePool.chainValue.toLocaleString()} ZEC</span>
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
        <table className="border-collapse  w-full rounded-lg first:tr">
        <thead>
          <tr className="p-0 lg:p-4 hidden lg:table-row">
              <th className="lg:border border-blue-300 text-left px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0 bg-blue-100 text-gray-500">Property</th>
              <th className="lg:border border-blue-300 text-left px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0 bg-blue-100">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Best Block Hash</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.bestblockhash}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Blocks</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.blocks.toLocaleString()}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Build</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.build}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Chain</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.chain}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Chain Supply</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.chainSupply.chainValue.toLocaleString()} ZEC</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Chain Supply Zat</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.chainSupply.chainValueZat.toLocaleString()}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Monitored</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.chainSupply.monitored ? 'Yes' : 'No'}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Chainwork</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.chainwork}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Commitments</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.commitments.toLocaleString()}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Chaintip</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.consensus.chaintip}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Next Block</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.consensus.nextblock}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Difficulty</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.difficulty.toLocaleString()}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Estimated Height</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.estimatedheight.toLocaleString()}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Headers</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.headers.toLocaleString()}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Initial Block Download Complete</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.initial_block_download_complete ? 'Yes' : "No"}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Pruned</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.pruned ? 'Yes' : "No"}</td>
          </tr>
          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
              <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Size on Disk</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{blockchainInfo.size_on_disk.toLocaleString()}</td>
          </tr>

          <tr className="p-0 lg:p-4 flex flex-col lg:table-row">
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-2 lg:py-2 text-sm text-gray-500">Verification Progress</td>
            <td className="lg:border border-blue-300 px-0 lg:px-2 pt-0 lg:py-2 font-bold break-all text-lg mb-4 lg:mb-0">{(blockchainInfo.verificationprogress * 100).toFixed(6)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
}