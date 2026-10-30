import { render, screen, waitFor } from '@testing-library/react';
import NodeCountChart from '../Charts/Zcash/NodeCountChart';

jest.mock('../Charts/ChartHeader', () => ({ __esModule: true, default: ({ title }: { title: string }) => <h2>{title}</h2> }));
jest.mock('../Charts/Zcash/ChartContainer', () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: ({ name }: { name: string }) => <span>{name}</span>,
  CartesianGrid: () => null, Legend: () => null, Tooltip: () => null,
  XAxis: () => null, YAxis: () => null,
}));
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

it('shows last observation, stale warning, and implementation series', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [{ Date: '07/04/2020', nodecount: '102' }] });
  render(<NodeCountChart chartRef={{ current: null }} />);
  expect(await screen.findByRole('status')).toHaveTextContent('102 endpoints');
  expect(screen.getByRole('status')).toHaveTextContent('more than three days old');
  for (const name of ['Total', 'Zebra', 'zcashd', 'Other']) expect(screen.getByText(name)).toBeInTheDocument();
});

it('shows fetch errors instead of an empty success chart', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false });
  render(<NodeCountChart chartRef={{ current: null }} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load');
});

it('handles an empty data file', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });
  render(<NodeCountChart chartRef={{ current: null }} />);
  expect(await screen.findByText('No node observations available.')).toBeInTheDocument();
});

it('aborts the outstanding request when unmounted', async () => {
  global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));
  const view = render(<NodeCountChart chartRef={{ current: null }} />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  const signal = (global.fetch as jest.Mock).mock.calls[0][1].signal;
  view.unmount();
  expect(signal.aborted).toBe(true);
});
