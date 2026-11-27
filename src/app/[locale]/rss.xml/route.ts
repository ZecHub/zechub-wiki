import { NextResponse } from 'next/server';
import RSS from 'rss';
import fs from 'fs';
import path from 'path';

const siteUrl = 'https://zechub.wiki';
const dashboardUrl = `${siteUrl}/dashboard`;
const jsonPath = path.join(process.cwd(), 'public/data/zcash/shielded_supply.json');

function parseObservationDate(value: string): Date | undefined {
  const parts = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!parts) return;
  const [, month, day, year] = parts;
  const iso = `${year}-${month}-${day}T00:00:00.000Z`;
  const date = new Date(iso);
  if (Number.isFinite(date.getTime()) && date.toISOString() === iso) return date;
}

export async function GET() {
  let latest: { close: string; supply: number; date: Date } | undefined;

  try {
    const data: unknown = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const row = Array.isArray(data) ? data.at(-1) : undefined;
    if (typeof row?.close === 'string' && Number.isFinite(row?.supply)) {
      const date = parseObservationDate(row.close);
      if (date) latest = { close: row.close, supply: row.supply, date };
    }
  } catch (error) {
    console.error('Failed to read shielded_supply.json:', error);
  }

  const feed = new RSS({
    title: 'ZecHub Dashboard - Shielded Supply',
    description: latest
      ? 'Latest Zcash shielded supply data from the official dataset'
      : 'Shielded supply data is unavailable. Open the dashboard for Zcash network analytics.',
    feed_url: `${siteUrl}/rss.xml`,
    site_url: latest ? siteUrl : dashboardUrl,
    language: 'en',
    pubDate: latest?.date.toUTCString(),
    ttl: 360,
    copyright: `© ${new Date().getFullYear()} ZecHub Community`,
  });

  if (latest) {
    const supply = latest.supply.toLocaleString('en-US');
    feed.item({
      title: `Shielded Supply: ${supply} ZEC`,
      description: `
        <strong>Date:</strong> ${latest.close}<br><br>
        <strong>Total Shielded Supply:</strong> ${supply} ZEC<br><br>
        This is the latest shielded supply figure from ZecHub's dataset.<br>
        View the full interactive dashboard for charts, history, and more metrics.
      `.trim(),
      url: dashboardUrl,
      guid: `shielded-supply-${latest.close}`,
      date: latest.date,
    });
  }

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
