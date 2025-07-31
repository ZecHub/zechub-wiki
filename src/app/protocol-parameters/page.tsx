"use client";
import React, { useState, useEffect } from 'react';

const GovernanceDashboard = () => {
  const [activeTab, setActiveTab] = useState<'parameters' | 'proposals'>('parameters');
  const [darkMode, setDarkMode] = useState(false);
  const [paramsData, setParamsData] = useState<any>(null);
  const [propsData, setPropsData] = useState<any>(null);
  const [loading, setLoading] = useState({ params: true, props: true });
  const [error, setError] = useState<{ params: string | null; props: string | null }>({ params: null, props: null });

  useEffect(() => {
    // Fetch Parameters Data
    const fetchParams = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/namada/protocol_parameters.json'
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        setParamsData(jsonData[0]);
      } catch (err) {
        setError(prev => ({ ...prev, params: err instanceof Error ? err.message : 'An unknown error occurred' }));
      } finally {
        setLoading(prev => ({ ...prev, params: false }));
      }
    };

    // Fetch Proposals Data
    const fetchProps = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/namada/props.json'
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        setPropsData(jsonData[0]);
      } catch (err) {
        setError(prev => ({ ...prev, props: err instanceof Error ? err.message : 'An unknown error occurred' }));
      } finally {
        setLoading(prev => ({ ...prev, props: false }));
      }
    };

    fetchParams();
    fetchProps();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading.params && loading.props) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Namada Governance Dashboard
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('parameters')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'parameters' 
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Protocol Parameters
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'proposals' 
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Governance Proposals
          </button>
        </div>

        {/* Content */}
        {activeTab === 'parameters' ? (
          <ParametersTab 
            data={paramsData} 
            loading={loading.params} 
            error={error.params} 
            darkMode={darkMode} 
          />
        ) : (
          <ProposalsTab 
            data={propsData} 
            loading={loading.props} 
            error={error.props} 
            darkMode={darkMode} 
          />
        )}
      </div>
    </div>
  );
};

const ParametersTab = ({ data, loading, error, darkMode }: any) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'}`}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen p-6">
        {/* Header with dark mode toggle */}
        

        {/* Main content grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Governance Parameters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-2">
              Governance Parameters
            </h2>
            <div className="space-y-3">
              {Object.entries(data.Governance_Parameters[0]).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {typeof value === 'number' ? value.toLocaleString() : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Public Goods Funding Parameters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-2">
              Public Goods Funding
            </h2>
            <div className="space-y-3">
              {Object.entries(data.Public_Goods_Funding_Parameters[0]).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {typeof value === 'number' ? `${value * 100}%` : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol Parameters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-2">
              Protocol Parameters
            </h2>
            <div className="space-y-3">
              {Object.entries(data.Protocol_Parameters[0])
                .filter(([key]) => !['VP_allowlist', 'Transactions_allowlist', 'Protocol_Parameters'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Proof of Stake Parameters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-2">
              Proof of Stake
            </h2>
            <div className="space-y-3">
              {Object.entries(data.Proof_Of_Stake_Parmeters[0]).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {typeof value === 'number' && key.includes('rate') ? `${value * 100}%` : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Allowlists Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-2">
            Allowlists
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">VP Allowlist</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md max-h-60 overflow-y-auto">
                {data.Protocol_Parameters[0].VP_allowlist.map((hash: string, i: number) => (
                  <div key={i} className="text-sm font-mono text-gray-600 dark:text-gray-300 mb-1 break-all">
                    {hash}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Transactions Allowlist</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md max-h-60 overflow-y-auto">
                {data.Protocol_Parameters[0].Transactions_allowlist.map((hash: string, i: number) => (
                  <div key={i} className="text-sm font-mono text-gray-600 dark:text-gray-300 mb-1 break-all">
                    {hash}
                  </div>
                ))}
                {/* <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  + {data.Protocol_Parameters[0].Transactions_allowlist.length - 5} more transactions...
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProposalsTab = ({ data, loading, error, darkMode }: any) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'}`}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Current Epoch: <span className="font-bold">{data.Last_committed_epoch}</span>
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Epoch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Epoch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Activation Epoch</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.Proposal.map((proposal: any) => (
              <tr key={proposal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{proposal.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{proposal.Type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">{proposal.Author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{proposal.Start_Epoch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{proposal.End_Epoch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{proposal.Activation_Epoch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GovernanceDashboard;