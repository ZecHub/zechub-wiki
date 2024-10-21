'use client';
import './donation.css';
import { ChangeEvent, useState } from 'react';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import zcashLogo from '../../../public/zcash-logo.png';
import ycashLogo from '../../../public/ycash-logo.png';

const DonationComp = () => {
  const [donationAmount, setDonationAmount] = useState(1); // Default donation amount in ZEC
  const [memo, setMemo] = useState(''); // Optional memo for the donation
  const [selectedCurrency, setSelectedCurrency] = useState('zcash'); // Track selected currency
  const [error, setError] = useState<string | null>(null); // Error state for invalid input

  const predefinedAmounts = [0.25, 0.5, 1.0, 2.5, 5];
  
  const zcashAddress = 'zcash:u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89';
  const ycashAddress = 'ys1t2e77wawylp8zky7wq3gzky2j4w6rpgd8632vmvqqj370thgpls8t973qutj4gn5wsc3qmcy56y';

  const handleSelectAmount = (amount: string) => {
    setDonationAmount(parseFloat(amount));
    setMemo(''); // Clear memo when a predefined amount is selected
    setError(null); // Clear error on valid selection
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount greater than 0 ZEC');
    } else {
      setDonationAmount(value);
      setMemo(event.target.value); // Synchronize memo with donation amount
      setError(null); // Clear error if input is valid
    }
  };

  const handleChangeMemo = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount greater than 0 ZEC');
    } else {
      setDonationAmount(value);
      setMemo(event.target.value);
      setError(null); // Clear error if input is valid
    }
  };

  const generateDonationLink = () => {
    if (error) return ''; // Return empty if there's an error
    const formattedAmount = parseFloat(donationAmount.toString()).toFixed(4); // Format amount to four decimal places
    const address = selectedCurrency === 'zcash' ? zcashAddress : ycashAddress;
    return `${address}?amount=${formattedAmount}&memo=${encodeURIComponent(memo)}`;
  };

  const copyAndOpenWallet = () => {
    if (error) {
      alert('Please enter a valid donation amount.');
      return;
    }
    const donationLink = generateDonationLink();
    navigator.clipboard.writeText(donationLink).then(() => {
      alert('Address copied to clipboard!');
      window.location.href = donationLink; // Attempt to open the link with the default wallet application
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className='donation-container'>
      <div style={{ width: '300px', margin: '20px auto', textAlign: 'center' }}>
        <QRCode value={generateDonationLink()} size={280} />
        <button onClick={copyAndOpenWallet} style={{ marginTop: '10px' }}>
          Copy & Open Wallet
        </button>

        <div className="currency-switch" style={{ marginTop: '10px' }}>
          <button
            onClick={() => setSelectedCurrency('zcash')}
            className={selectedCurrency === 'zcash' ? 'active' : ''}
            style={{ borderRadius: '50%', padding: '10px', margin: '5px' }}
          >
            <Image src={zcashLogo} alt='Zcash' width={32} height={32} />
          </button>
          <button
            onClick={() => setSelectedCurrency('ycash')}
            className={selectedCurrency === 'ycash' ? 'active' : ''}
            style={{ borderRadius: '50%', padding: '10px', margin: '5px' }}
          >
            <Image src={ycashLogo} alt='Ycash' width={32} height={32} />
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
            <label>Choose your donation amount (ZEC):</label>
            <input
              type='range'
              min='0.25'
              max='5'
              step='0.05'
              value={donationAmount <= 5 ? donationAmount : 5} // Sync with slider up to 5 ZEC
              onChange={handleChangeAmount}
              className='slider'
            />
          </div>

          <div className='amount'>
            <p>Amount: {donationAmount} </p>
          </div>

          <div className='amount-buttons'>
            {predefinedAmounts.map((amount, index) => (
              <button key={index} onClick={() => handleSelectAmount(amount.toString())}>
                {amount} ZEC
              </button>
            ))}
          </div>

          <div className='input-number'>
            <label>Enter Amount (ZEC):</label>
            <input
              type='number'
              value={memo}
              placeholder='Enter any amount in ZEC'
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
