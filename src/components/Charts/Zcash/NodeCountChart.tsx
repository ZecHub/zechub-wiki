"use client";

import { RefObject, useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { parseNodeCounts } from '@/lib/chart/node-count';
import ChartContainer from './ChartContainer';
import ChartHeader from '../ChartHeader';

type Observation = ReturnType<typeof parseNodeCounts>[number];

export default function NodeCountChart({ chartRef }: { chartRef: RefObject<HTMLDivElement | null> }) {
  const [data, setData] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/data/zcash/nodecount.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to fetch node counts');
        const observations = parseNodeCounts(await response.json());
        if (!controller.signal.aborted) setData(observations);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  const latest = data.at(-1);
  const stale = latest && Date.now() - latest.timestamp > 3 * 86400000;

  return (
    <section aria-label="Node Count">
      <ChartHeader title="Reachable Zcash Nodes" />
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Public endpoints observed by the crawler, grouped by self-reported software.
        Nodes behind NAT, offline nodes, and Tor/I2P nodes are not included.
        Historical implementation breakdowns are unavailable.
      </p>
      {error ? <p role="alert">Unable to load node counts. Please try again later.</p>
        : !loading && !latest ? <p>No node observations available.</p>
        : <>
          {latest && <p className="mb-3 text-sm" role="status">
            Last observation: {latest.date} (UTC) — {latest.total} endpoints.
            {stale && ' Data is more than three days old; the crawler may need attention.'}
          </p>}
          <ChartContainer ref={chartRef} loading={loading}>
            <LineChart data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey="timestamp" type="number" domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => new Date(value).toISOString().slice(0, 10)} />
              <YAxis allowDecimals={false} domain={[0, 'auto']} />
              <Tooltip labelFormatter={(value) => new Date(Number(value)).toISOString().slice(0, 10)} />
              <Legend />
              <Line dataKey="total" name="Total" stroke="#64748b" strokeDasharray="5 3" dot={false} />
              <Line dataKey="zebra" name="Zebra" stroke="#a855f7" strokeWidth={2} connectNulls={false} dot={{ r: 2 }} />
              <Line dataKey="zcashd" name="zcashd" stroke="#f59e0b" strokeWidth={2} connectNulls={false} dot={{ r: 2 }} />
              <Line dataKey="other" name="Other" stroke="#06b6d4" strokeWidth={2} connectNulls={false} dot={{ r: 2 }} />
            </LineChart>
          </ChartContainer>
        </>}
    </section>
  );
}
