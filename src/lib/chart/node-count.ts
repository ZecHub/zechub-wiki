import type { NodeCountData } from './types';

export function parseNodeCounts(value: unknown) {
  if (!Array.isArray(value)) throw new Error('Invalid node count data');
  return value.map((row: NodeCountData) => {
    if (!row || typeof row.Date !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(row.Date)) {
      throw new Error('Invalid observation date');
    }
    const [month, day, year] = row.Date.split('/').map(Number);
    const timestamp = Date.UTC(year, month - 1, day);
    const date = new Date(timestamp);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new Error('Invalid observation date');
    }
    if (typeof row.nodecount !== 'string' || !/^\d+$/.test(row.nodecount)) {
      throw new Error('Invalid node count');
    }
    const total = Number(row.nodecount);
    if (!Number.isSafeInteger(total)) throw new Error('Invalid node count');
    const breakdown = [row.zebra, row.zcashd, row.other];
    const hasBreakdown = breakdown.some((count) => count !== undefined);
    if (hasBreakdown && (breakdown.some((count) => !Number.isSafeInteger(count) || count! < 0)
      || breakdown.reduce<number>((sum, count) => sum + count!, 0) !== total)) {
      throw new Error('Invalid implementation counts');
    }
    return {
      date: row.Date, timestamp, total,
      zebra: hasBreakdown ? row.zebra! : null,
      zcashd: hasBreakdown ? row.zcashd! : null,
      other: hasBreakdown ? row.other! : null,
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
}
