'use client';
import './donation.css';
import { ChangeEvent, useState } from 'react';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import zcashLogo from '../../../public/zcash-logo.png';
import ycashLogo from '../../../public/ycash-logo.png';
// You can add a Namada logo here if available
import namadaLogo from '../../../public/namada-logo.png'; // Placeholder

const DonationComp = () => {
  const [donationAmount, setDonationAmount] = useState(1); // Default donation amount
  const [memo, setMemo] = useState(''); // Optional memo for the donation
  const [selectedCurrency, setSelectedCurrency] = useState('zcash'); // Track selected currency
  const [error, setError] = useState<string | null>(null); // Error state for invalid input

  // Predefined amounts for Zcash, Ycash, and Namada
  const predefinedZecAmounts = [0.25, 0.5, 1.0, 2.5, 5];
  const predefinedYecAmounts = [100, 200, 400, 1000];
  const predefinedNamAmounts = [1, 2, 5, 10, 20]; // Adjust according to typical Namada donations

  const zcashAddress = 'zcash:u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89';
  const ycashAddress = 'ys1t2e77wawylp8zky7wq3gzky2j4w6rpgd8632vmvqqj370thgpls8t973qutj4gn5wsc3qmcy56y';
  const namadaAddress = 'znam1qp9v3gvs6dx576wx938kns0xx5ancxgv7z8athjq3gp7qp4uxk9qzdqdwqycpkyp0emtlsg9wlzzr'; // Namada donation address

  const handleSelectAmount = (amount: string) => {
    setDonationAmount(parseFloat(amount));
    setMemo(''); // Clear memo when a predefined amount is selected
    setError(null); // Clear error on valid selection
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount greater than 0');
    } else {
      setDonationAmount(value);
      setMemo(event.target.value); // Synchronize memo with donation amount
      setError(null); // Clear error if input is valid
    }
  };

  const handleChangeMemo = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount greater than 0');
    } else {
      setDonationAmount(value);
      setMemo(event.target.value);
      setError(null); // Clear error if input is valid
    }
  };

  const generateDonationLink = () => {
    if (error) return ''; // Return empty if there's an error
    const formattedAmount = parseFloat(donationAmount.toString()).toFixed(4); // Format amount to four decimal places
    const address =
      selectedCurrency === 'zcash'
        ? zcashAddress
        : selectedCurrency === 'ycash'
        ? ycashAddress
        : namadaAddress;
    return `${address}?amount=${formattedAmount}&memo=${encodeURIComponent(memo)}`;
  };

  const copyAndOpenWallet = () => {
    if (error) {
      alert('Please enter a valid donation amount.');
      return;
    }
    const donationLink = generateDonationLink();
    navigator.clipboard.writeText(donationLink).then(
      () => {
        alert('Address copied to clipboard!');
        window.location.href = donationLink; // Attempt to open the link with the default wallet application
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className='donation-container'>
      <div style={{ width: '300px', margin: '20px auto', textAlign: 'center' }}>
        <QRCode value={generateDonationLink()} size={280} />
        <button onClick={copyAndOpenWallet} style={{ marginTop: '10px' }}>
          Copy & Open Wallet
        </button>

        <div className='currency-switch' style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          {/* Zcash button */}
          <button
            onClick={() => setSelectedCurrency('zcash')}
            className={selectedCurrency === 'zcash' ? 'active' : ''}
            style={{
              borderRadius: '50%',
              padding: '10px',
              margin: '5px',
              border: selectedCurrency === 'zcash' ? '3px solid lightblue' : '3px solid transparent',
              width: '80px',
              height: '80px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image src={zcashLogo} alt='Zcash' width={32} height={32} />
          </button>

          {/* Ycash button */}
          <button
            onClick={() => setSelectedCurrency('ycash')}
            className={selectedCurrency === 'ycash' ? 'active' : ''}
            style={{
              borderRadius: '50%',
              padding: '10px',
              margin: '5px',
              border: selectedCurrency === 'ycash' ? '3px solid lightblue' : '3px solid transparent',
              width: '80px',
              height: '80px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image src={ycashLogo} alt='Ycash' width={32} height={32} />
          </button>

          {/* Namada button */}
          <button
            onClick={() => setSelectedCurrency('namada')}
            className={selectedCurrency === 'namada' ? 'active' : ''}
            style={{
              borderRadius: '50%',
              padding: '10px',
              margin: '5px',
              border: selectedCurrency === 'namada' ? '3px solid lightblue' : '3px solid transparent',
              width: '80px',
              height: '80px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image src={namadaLogo} alt='Namada' width={32} height={32} />
          </button>
        </div>
      </div>

      <div className='donation-slider'>
        <div className='donation-header'>
          <h1>Donate Now</h1>
          <p>
            The goal of ZecHub is to provide an educational platform where
            community members can work together on creating, validating, and
            promoting content that supports the Zcash & Privacy technology
            ecosystems.
          </p>

          <div className='input-range'>
            <label>Choose your donation amount ({selectedCurrency === 'zcash' ? 'ZEC' : selectedCurrency === 'ycash' ? 'YEC' : 'NAM'}):</label>
            <input
              type='range'
              min={selectedCurrency === 'zcash' ? '0.25' : selectedCurrency === 'ycash' ? '100' : '1'}
              max={selectedCurrency === 'zcash' ? '5' : selectedCurrency === 'ycash' ? '1000' : '20'}
              step={selectedCurrency === 'zcash' ? '0.05' : selectedCurrency === 'ycash' ? '50' : '1'}
              value={donationAmount <= (selectedCurrency === 'zcash' ? 5 : selectedCurrency === 'ycash' ? 1000 : 20) ? donationAmount : 5} // Sync with slider
              onChange={handleChangeAmount}
              className='slider'
            />
          </div>

          <div className='amount'>
            <p>Amount: {donationAmount} {selectedCurrency === 'zcash' ? 'ZEC' : selectedCurrency === 'ycash' ? 'YEC' : 'NAM'}</p>
          </div>

          <div className='amount-buttons'>
            {(selectedCurrency === 'zcash'
              ? predefinedZecAmounts
              : selectedCurrency === 'ycash'
              ? predefinedYecAmounts
              : predefinedNamAmounts
            ).map((amount, index) => (
              <button key={index} onClick={() => handleSelectAmount(amount.toString())}>
                {amount} {selectedCurrency === 'zcash' ? 'ZEC' : selectedCurrency === 'ycash' ? 'YEC' : 'NAM'}
              </button>
            ))}
          </div>

          <div className='input-number'>
            <label>Enter Amount ({selectedCurrency === 'zcash' ? 'ZEC' : selectedCurrency === 'ycash' ? 'YEC' : 'NAM'}):</label>
            <input
              type='number'
              value={memo}
              placeholder={`Enter any amount in ${selectedCurrency === 'zcash' ? 'ZEC' : selectedCurrency === 'ycash' ? 'YEC' : 'NAM'}`}
              onChange={handleChangeMemo}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default DonationComp;
