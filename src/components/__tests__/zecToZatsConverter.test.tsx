import { act, fireEvent, render, screen } from '@testing-library/react';
import ZecToZatsConverter from '../Converter/ZecToZatsConverter';

describe('ZEC/Zats converter input', () => {
  it.each([false, true])('rejects invalid Zats input (swapped: %s)', (swapped) => {
    render(<ZecToZatsConverter />);
    if (swapped) fireEvent.click(screen.getByRole('button', { name: 'Swap units' }));
    const inputs = screen.getAllByRole('textbox');
    const zats = inputs[swapped ? 0 : 1];
    const zec = inputs[swapped ? 1 : 0];

    // A paste must not silently become a different amount by losing its
    // decimal point, sign, exponent, or other non-numeric characters.
    for (const value of ['1.5', '-5', '1e3', '12abc34']) {
      fireEvent.change(zats, { target: { value } });
      expect(zats).toHaveValue('100,000,000');
      expect(zec).toHaveValue('1');
    }
  });

  it.each([false, true])('accepts grouped integers and whole Zats (swapped: %s)', (swapped) => {
    render(<ZecToZatsConverter />);
    if (swapped) fireEvent.click(screen.getByRole('button', { name: 'Swap units' }));
    const inputs = screen.getAllByRole('textbox');
    const zats = inputs[swapped ? 0 : 1];
    const zec = inputs[swapped ? 1 : 0];

    fireEvent.change(zats, { target: { value: '125,000,000' } });
    expect(zats).toHaveValue('125,000,000');
    expect(zec).toHaveValue('1.25000000');

    fireEvent.change(zats, { target: { value: '1' } });
    expect(zats).toHaveValue('1');
    expect(zec).toHaveValue('0.00000001');

    fireEvent.change(zec, { target: { value: '0.00000002' } });
    expect(zats).toHaveValue('2');
    expect(zec).toHaveValue('0.00000002');
  });
});

describe('converter clipboard feedback', () => {
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  let writeText: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  });

  afterEach(() => {
    jest.useRealTimers();
    if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });

  async function clickCopy(name: string) {
    await act(async () => { fireEvent.click(screen.getByRole('button', { name })); });
  }

  it('clears success on an accepted edit to either converted amount', async () => {
    render(<ZecToZatsConverter />);
    await clickCopy('Copy ZEC');
    await clickCopy('Copy Zats');
    expect(screen.getAllByRole('button', { name: 'Copied!' })).toHaveLength(2);
    expect(writeText.mock.calls).toEqual([['1'], ['100000000']]);

    fireEvent.change(screen.getByRole('textbox', { name: 'Zats' }), { target: { value: '200000000' } });
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'ZEC' })).toHaveValue('2.00000000');
    await clickCopy('Copy ZEC');
    expect(writeText).toHaveBeenLastCalledWith('2.00000000');
  });

  it('clears success when units are swapped and copies the new raw amount', async () => {
    render(<ZecToZatsConverter />);
    await clickCopy('Copy ZEC');
    fireEvent.click(screen.getByRole('button', { name: 'Swap units' }));
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    await clickCopy('Copy Zats');
    expect(writeText.mock.calls).toEqual([['1'], ['100000000']]);
  });

  it('ignores an older clipboard completion after the value changes', async () => {
    let finish!: () => void;
    writeText.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
    render(<ZecToZatsConverter />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy ZEC' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'ZEC' }), { target: { value: '2' } });
    await act(async () => { finish(); });
    expect(writeText).toHaveBeenCalledWith('1');
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy ZEC' })).toBeEnabled();
  });

  it('prevents a repeated write while that copy is pending', async () => {
    let finish!: () => void;
    writeText.mockImplementation(() => new Promise<void>(resolve => { finish = resolve; }));
    render(<ZecToZatsConverter />);
    const button = screen.getByRole('button', { name: 'Copy ZEC' });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(writeText).toHaveBeenCalledTimes(1);
    await act(async () => { finish(); });
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeEnabled();
  });

  it('keeps success for a rejected edit and expires it after two seconds', async () => {
    render(<ZecToZatsConverter />);
    await clickCopy('Copy Zats');
    fireEvent.change(screen.getByRole('textbox', { name: 'Zats' }), { target: { value: '1.5' } });
    expect(screen.getByRole('textbox', { name: 'Zats' })).toHaveValue('100,000,000');
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(2000); });
    expect(screen.getByRole('button', { name: 'Copy Zats' })).toBeInTheDocument();
  });

  it('reports clipboard denial and allows a successful retry', async () => {
    writeText.mockRejectedValueOnce(new Error('Clipboard denied'));
    render(<ZecToZatsConverter />);
    await clickCopy('Copy ZEC');
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    await clickCopy('Copy failed — retry ZEC');
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(writeText.mock.calls).toEqual([['1'], ['1']]);
  });

  it('invalidates a pending copy on a unit-only swap of zero values', async () => {
    let finish!: () => void;
    writeText.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
    render(<ZecToZatsConverter />);
    fireEvent.change(screen.getByRole('textbox', { name: 'ZEC' }), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Copy ZEC' }));
    fireEvent.click(screen.getByRole('button', { name: 'Swap units' }));
    await act(async () => { finish(); });
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith('0');
  });
});
