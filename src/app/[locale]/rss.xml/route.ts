import { NextResponse } from 'next/server';
import RSS from 'rss';
import fs from 'fs';
import path from 'path';

const siteUrl = 'https://zechub.wiki';
const jsonPath = path.join(process.cwd(), 'public/data/zcash/shielded_supply.json');

export async function GET() {
  let shieldedData: any[] = [];

  try {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    shieldedData = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read shielded_supply.json:', error);
  }

  const latest = shieldedData.length > 0 
    ? shieldedData[shieldedData.length - 1] 
    : null;

  const feed = new RSS({
    title: 'ZecHub Dashboard - Shielded Supply',
    description: 'Latest Zcash shielded supply data from the official dataset',
    feed_url: `${siteUrl}/rss.xml`,
    site_url: siteUrl,
    language: 'en',
    pubDate: new Date().toUTCString(),
    ttl: 360,
    copyright: `© ${new Date().getFullYear()} ZecHub Community`,
  });

  if (latest) {
    feed.item({
      title: `Shielded Supply: ${latest.supply?.toLocaleString() || 'N/A'} ZEC`,
      description: `
        <strong>Date:</strong> ${latest.close || 'Unknown'}<br><br>
        <strong>Total Shielded Supply:</strong> ${latest.supply?.toLocaleString() || 'N/A'} ZEC<br>
        <strong>Updated:</strong> ${new Date().toLocaleString()}<br><br>
        This is the latest shielded supply figure from ZecHub's dataset.<br>
        View the full interactive dashboard for charts, history, and more metrics.
      `.trim(),
      url: `${siteUrl}/dashboard`,
      guid: `shielded-supply-${latest.close || Date.now()}`,
      date: latest.close ? new Date(latest.close) : new Date(),
    });
  } else {
    feed.item({
      title: 'ZecHub Dashboard',
      description: 'Live Zcash network analytics and visualizations.',
      url: `${siteUrl}/dashboard`,
      guid: `${siteUrl}/dashboard`,
      date: new Date(),
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