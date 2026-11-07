import { parseNodeCounts } from '../chart/node-count';

describe('node count observations', () => {
  it('preserves unknown historical breakdowns and sorts real dates', () => {
    const rows = parseNodeCounts([
      { Date: '10/14/2026', nodecount: '3', zebra: 2, zcashd: 1, other: 0 },
      { Date: '07/04/2026', nodecount: '102' },
    ]);
    expect(rows[0]).toMatchObject({ total: 102, zebra: null, zcashd: null, other: null });
    expect(rows[1]).toMatchObject({ total: 3, zebra: 2, zcashd: 1, other: 0 });
  });
  it.each([
    null, {}, [{ Date: '02/31/2026', nodecount: '1' }],
    [{ Date: '10/14/2026', nodecount: '-1' }],
    [{ Date: '10/14/2026', nodecount: '2', zebra: 1 }],
    [{ Date: '10/14/2026', nodecount: '2', zebra: 1, zcashd: 0, other: 0 }],
  ])('rejects malformed observations: %p', (value) => {
    expect(() => parseNodeCounts(value)).toThrow();
  });
});
