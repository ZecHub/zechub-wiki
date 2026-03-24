"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/Table";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchTreasuryFromSheet } from "@/lib/parseTreasurySheet";

const PIE_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
  "#f97316",
];

const TREASURY_CARD =
  "border-slate-300/50 dark:border-slate-600/40 shadow-none";

const TREASURY_INNER_TILE = "border-slate-300/45 dark:border-slate-600/35";

const TREASURY_TABLE_HEAD =
  "[&_tr]:border-b [&_tr]:border-slate-300/50 dark:[&_tr]:border-slate-600/40";

const TREASURY_TABLE_ROW = "border-slate-300/50 dark:border-slate-600/40";

const TREASURY_ROW_DIVIDE =
  "divide-y divide-slate-300/50 dark:divide-slate-600/40";

type FPFData = {
  Category: string[];
  "Amount (ZEC)": number[];
  Allocation: number[];
};

type PairSection = { title: string; body: Record<string, string> };

function isNumericSummaryObject(o: Record<string, unknown>): boolean {
  if (
    "FPF" in o ||
    "Last Updated" in o ||
    "Zcash Price" in o ||
    "Total Paid Out | ZEC" in o ||
    "To Be Paid Out USD | ZEC" in o
  ) {
    return false;
  }
  const vals = Object.values(o);
  if (vals.length === 0) return false;
  return vals.every((v) => typeof v === "number" && Number.isFinite(v));
}

function formatTreasuryNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function formatTreasuryFieldDisplay(
  fieldKey: string,
  value: string | number,
): string {
  if (fieldKey === "Total USD Value" || fieldKey === "USD Reserved") {
    const n =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/,/g, ""));
    if (Number.isFinite(n)) {
      const opts: Intl.NumberFormatOptions = Number.isInteger(n)
        ? {}
        : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
      return `$${n.toLocaleString(undefined, opts)}`;
    }
    return value === "" ? "" : `$${value}`;
  }

  if (fieldKey.endsWith(" Price")) {
    const n =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/,/g, ""));
    if (Number.isFinite(n)) {
      const opts: Intl.NumberFormatOptions = Number.isInteger(n)
        ? {}
        : { minimumFractionDigits: 2, maximumFractionDigits: 6 };
      return `$${n.toLocaleString(undefined, opts)}`;
    }
    return value === "" ? "" : `$${value}`;
  }

  if (typeof value === "number") return formatTreasuryNumber(value);
  return value;
}

function extractSections(data: unknown[]) {
  let header: Record<string, string> | null = null;
  let fpf: FPFData | null = null;
  const fpfNumericBlocks: Array<Record<string, number>> = [];
  const pairSections: PairSection[] = [];
  let paidOut: Record<string, string> | null = null;
  let toBePaid: Record<string, string> | null = null;

  for (const item of data) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const o = item as Record<string, unknown>;

    if (
      "FPF" in o &&
      o.FPF &&
      typeof o.FPF === "object" &&
      !Array.isArray(o.FPF)
    ) {
      fpf = o.FPF as FPFData;
      continue;
    }
    if ("Last Updated" in o || "Zcash Price" in o) {
      header = o as Record<string, string>;
      continue;
    }
    if ("Total Paid Out | ZEC" in o) {
      paidOut = o as Record<string, string>;
      continue;
    }
    if ("To Be Paid Out USD | ZEC" in o) {
      toBePaid = o as Record<string, string>;
      continue;
    }
    if (isNumericSummaryObject(o)) {
      fpfNumericBlocks.push(o as Record<string, number>);
      continue;
    }

    const keys = Object.keys(o);
    if (keys.length === 1) {
      const title = keys[0];
      const val = o[title];
      if (val && typeof val === "object" && !Array.isArray(val)) {
        const body: Record<string, string> = {};
        for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
          body[k] = v == null ? "" : String(v);
        }
        pairSections.push({ title, body });
      }
    }
  }

  return { header, fpf, fpfNumericBlocks, pairSections, paidOut, toBePaid };
}

function fpfPieRows(fpf: FPFData) {
  return fpf.Category.map((name, i) => ({
    name,
    value: fpf.Allocation[i] ?? fpf["Amount (ZEC)"][i] ?? 0,
  })).filter((r) => r.value > 0);
}

function paidOutPieRows(paid: Record<string, string>) {
  const totalKey = "Total Paid Out | ZEC";
  return Object.entries(paid)
    .filter(([k]) => k !== totalKey)
    .map(([name, v]) => ({ name, value: Number(v) || 0 }))
    .filter((r) => r.value > 0);
}

function PieLegend({
  data,
}: {
  data: { name: string; value: string; color: string }[];
}) {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {data.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/40 border border-border/40"
        >
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-muted-foreground truncate flex-1 min-w-0">
            {item.name}
          </span>
          <span className="text-sm font-mono font-semibold tabular-nums ml-2 flex-shrink-0">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SheetTreasuryTab() {
  const [rows, setRows] = useState<unknown[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchTreasuryFromSheet()
      .then((d) => {
        if (!cancelled) {
          setRows(d);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Failed to load treasury");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { header, fpf, fpfNumericBlocks, pairSections, paidOut, toBePaid } =
    useMemo(() => extractSections(rows ?? []), [rows]);

  const fpfPie = useMemo(() => (fpf ? fpfPieRows(fpf) : []), [fpf]);
  const paidPie = useMemo(
    () => (paidOut ? paidOutPieRows(paidOut) : []),
    [paidOut],
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading treasury sheet…
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!rows?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No treasury data.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {header && (
        <Card className={TREASURY_CARD}>
          <CardHeader>
            <CardTitle>Treasury overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(header).map(([k, v]) => (
                <div
                  key={k}
                  className={`rounded-xl border bg-muted/30 p-4 ${TREASURY_INNER_TILE}`}
                >
                  <div className="text-muted-foreground">{k}</div>
                  <div className="text-lg font-semibold mt-1">
                    {formatTreasuryFieldDisplay(k, v)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {fpfPie.length > 0 && (
          <Card className={TREASURY_CARD}>
            <CardHeader>
              <CardTitle>ZEC Treasury</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={fpfPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {fpfPie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) =>
                      v != null ? `${v.toLocaleString()} ZEC` : "—"
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <PieLegend
                data={fpfPie.map((d, i) => ({
                  name: d.name,
                  value: `${d.value.toLocaleString()} ZEC`,
                  color: PIE_COLORS[i % PIE_COLORS.length],
                }))}
              />
            </CardContent>
          </Card>
        )}

        {paidPie.length > 0 && (
          <Card className={TREASURY_CARD}>
            <CardHeader className="imd:flex-row imd:items-center justify-between">
              <CardTitle>USD Paid out to date</CardTitle>
              {paidOut?.["Total Paid Out | ZEC"] != null && (
                <p className="text-sm text-muted-foreground font-normal">
                  Total: $
                  {Number(paidOut["Total Paid Out | ZEC"]).toLocaleString()}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={paidPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {paidPie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) =>
                      v != null ? `$${v.toLocaleString()}` : "—"
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <PieLegend
                data={paidPie.map((d, i) => ({
                  name: d.name,
                  value: `$${d.value.toLocaleString()}`,
                  color: PIE_COLORS[i % PIE_COLORS.length],
                }))}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {fpf && (
        <Card className={TREASURY_CARD}>
          <CardHeader>
            <CardTitle>FPF</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className={TREASURY_TABLE_HEAD}>
                <TableRow className={TREASURY_TABLE_ROW}>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount (ZEC)</TableHead>
                  <TableHead className="text-right">Allocation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fpf.Category.map((cat, i) => (
                  <TableRow key={`${cat}-${i}`} className={TREASURY_TABLE_ROW}>
                    <TableCell className="font-medium">{cat}</TableCell>
                    <TableCell className="text-right font-mono">
                      {fpf["Amount (ZEC)"][i] != null
                        ? fpf["Amount (ZEC)"][i].toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {fpf.Allocation[i] != null
                        ? `${fpf.Allocation[i].toLocaleString()}%`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {fpfNumericBlocks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            FPF balances &amp; reserves
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fpfNumericBlocks.map((block, i) => (
              <Card key={i} className={TREASURY_CARD}>
                <CardContent className={`pt-6 ${TREASURY_ROW_DIVIDE}`}>
                  {Object.entries(block).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between gap-4 text-sm py-2.5 first:pt-0"
                    >
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-mono font-medium tabular-nums">
                        {formatTreasuryFieldDisplay(k, v)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pairSections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pairSections.map(({ title, body }) => (
            <Card key={title} className={TREASURY_CARD}>
              <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className={TREASURY_ROW_DIVIDE}>
                {Object.entries(body).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4 text-sm py-2.5 first:pt-0"
                  >
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-mono font-medium">
                      {formatTreasuryFieldDisplay(k, v)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {paidOut && (
        <Card className={TREASURY_CARD}>
          <CardHeader>
            <CardTitle>Total Paid Out USD | ZEC</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(paidOut).map(([k, v]) => (
                  <TableRow key={k} className={TREASURY_TABLE_ROW}>
                    <TableCell
                      className={
                        k === "Total Paid Out | ZEC" ? "font-semibold" : ""
                      }
                    >
                      {k}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${Number(v).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {toBePaid && (
        <Card className={TREASURY_CARD}>
          <CardHeader>
            <CardTitle>To Be Paid Out USD | ZEC</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {Object.entries(toBePaid).map(([k, v]) => (
                  <TableRow key={k} className={TREASURY_TABLE_ROW}>
                    <TableCell
                      className={
                        k === "To Be Paid Out USD | ZEC" ? "font-semibold" : ""
                      }
                    >
                      {k}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${Number(v).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
