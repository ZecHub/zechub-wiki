import { fireEvent, render, screen } from '@testing-library/react';
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
