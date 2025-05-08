"use client";

import React, { useEffect, useState } from "react";

/**
 * PrivacySetVisualization
 * Rings radiate from center in year order (2022→2025), hover to highlight
 */

type TransactionSummaryDatum = {
  height: number;
  sapling: number;
  orchard: number;
};

// Map block heights to years
const HEIGHT_YEAR_MAP = [
  // Approximate blocks per year (~418k)
  { start: 0, end: 257775, year: "2018" },
  { start: 257776, end: 676656, year: "2019" },
  { start: 676657, end: 1095537, year: "2020" },
  { start: 1095538, end: 1514418, year: "2021" },
  { start: 1514419, end: 1933299, year: "2022" },
  { start: 1933300, end: 2352180, year: "2023" },
  { start: 2352181, end: 2771014, year: "2024" },
  { start: 2771015, end: Infinity, year: "2025" },
];

const DATA_URL =
  "https://raw.githubusercontent.com/ZecHub/zechub-wiki/main/public/data/transaction_summary.json";

const PrivacySetVisualization: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearly, setYearly] = useState<
    Map<string, { sapling: number; orchard: number }>
  >(new Map());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: TransactionSummaryDatum[] = await res.json();
        const agg = new Map<string, { sapling: number; orchard: number }>();
        raw.forEach(({ height, sapling, orchard }) => {
          const year =
            HEIGHT_YEAR_MAP.find(
              (r) => height >= r.start && height <= r.end
            )?.year || "Unknown";
          if (!agg.has(year)) agg.set(year, { sapling: 0, orchard: 0 });
          const e = agg.get(year)!;
          e.sapling += sapling;
          e.orchard += orchard;
        });
        setYearly(agg);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  // Chronological order
  const years = ["2018","2019","2020","2021","2022","2023","2024","2025"];  // full range
  const entries = years.map((y) => [y, yearly.get(y) ?? { sapling: 0, orchard: 0 }] as [string, { sapling: number; orchard: number }]);

  const saplingData = entries.map(([y, v]) => [y, v.sapling] as [string, number]);
  const orchardData = entries.map(([y, v]) => [y, v.orchard] as [string, number]);
  const totalSapling = saplingData.reduce((sum, [,v]) => sum+v, 0);
  const totalOrchard = orchardData.reduce((sum, [,v]) => sum+v, 0);

  // Radii by chronological index
  const minR = 20; // smaller inner radius
  const maxR = 200; // larger outer radius
  const step = (maxR - minR) / (years.length - 1);

  const humanize = (v: number) =>
    v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(1)}k` : `${v}`;

  // Render one cluster
  const renderCluster = (
    data: [string, number][],
    cx: number,
    color: string,
    type: string
  ) =>
    data.map(([year, val], idx) => {
      const id = `${type}-${year}`;
      const isHover = hoveredId === id;
      const r = minR + idx * step;
      const cy = 350 + (isHover ? -10 : 0);
      const opac = isHover ? 0.4 : 0.2;
      const sw = isHover ? 3 : 2;
      return (
        <g
          key={id}
          transform={`translate(${cx},${cy})`}
          style={{ cursor: 'pointer' }}
          onMouseEnter={()=>setHoveredId(id)}
          onMouseLeave={()=>setHoveredId(null)}
        >
          <circle r={r} fill={color} fillOpacity={opac} stroke={color} strokeWidth={sw} />
          <text x={0} y={-r-10} textAnchor='middle' fill={color} fontSize={14} fontWeight='bold'>
            {year}
          </text>
          <text x={0} y={r+20} textAnchor='middle' fill={color} fontSize={12}>
            {humanize(val)}
          </text>
        </g>
      );
    });

  const sapX = 300, orchX = 900;

  return (
    <div style={{background:'#f8f4e8', padding:20, borderRadius:8, overflow:'visible'}}>
      <svg width={1200} height={650} style={{margin:'0 auto', display:'block'}}>
        {/* Title/Sub */}
        <text x={60} y={50} fill='#d4a017' fontSize={28} fontWeight='bold'>Zcash shielded transactions</text>
        <text x={60} y={80} fill='#333' fontSize={14}>Privacy set based on Orchard & Sapling shielded transactions</text>

        {/* Total rings */}
        <circle cx={sapX} cy={350} r={maxR+10} fill='none' stroke='#d4a017' strokeOpacity={0.4} strokeWidth={4}/>
        <circle cx={orchX} cy={350} r={maxR+10} fill='none' stroke='#111' strokeOpacity={0.4} strokeWidth={4}/>

        {/* Clusters */}
        {renderCluster(saplingData, sapX, '#d4a017','sapling')}
        {renderCluster(orchardData, orchX, '#111','orchard')}

        {/* Legend */}
        <g transform='translate(1040,600)'>
          <rect width={16} height={16} fill='#d4a017'/>
          <text x={24} y={12} fill='#333' fontSize={12}>Sapling (total: {humanize(totalSapling)})</text>
          <rect y={24} width={16} height={16} fill='#111'/>
          <text x={24} y={36} fill='#333' fontSize={12}>Orchard (total: {humanize(totalOrchard)})</text>
        </g>
      </svg>
    </div>
  );
};

export default PrivacySetVisualization;
