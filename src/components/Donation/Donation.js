'use client';
import './donation.css';
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import donateGif from '../../../public/donate.gif';

const DonationComp = () => {
  const [donationAmount, setDonationAmount] = useState(1); // Default donation amount in ZEC
  const [memo, setMemo] = useState(''); // Optional memo for the donation

  const predefinedAmounts = [0.25, 0.5, 1.0, 2.5, 5];

  const handleSelectAmount = (amount) => {
    setDonationAmount(amount);
    setMemo(''); // Clear memo when a predefined amount is selected
  };

  const handleChangeAmount = (event) => {
    const value = event.target.value;
    setDonationAmount(value);
    setMemo(value); // Synchronize memo with donation amount
  };

  const handleChangeMemo = (event) => {
    setMemo(event.target.value);
    setDonationAmount(event.target.value); // Synchronize donation amount with memo
  };

  const generateDonationLink = () => {
    const formattedAmount = parseFloat(donationAmount).toFixed(4); // Format amount to four decimal places
    const zcashAddress = 'zcash:u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89'; // Replace 'your_zcash_address_here' with your actual Zcash address
    const zcashDonationLink = `${zcashAddress}?amount=${formattedAmount}&memo=${encodeURIComponent(memo)}`;
    return zcashDonationLink;
  };

  const copyAndOpenWallet = () => {
    const donationLink = generateDonationLink();
    navigator.clipboard.writeText(donationLink).then(() => {
      alert('Zcash address copied to clipboard!'); // Optional: Provide feedback to the user that the link has been copied.
      window.location.href = donationLink; // Attempt to open the link with the default wallet application
    }, (err) => {
      console.error('Could not copy text: ', err); // Optional: Provide error feedback.
    });
  };

  return (
    <div className='donation-container'>
      <div className='zcash-image'>
        <Image src={donateGif} alt='Zcash Donation' />
      </div>

      <div style={{ width: '300px', margin: '20px auto', textAlign: 'center' }}>
        <QRCode value={generateDonationLink()} size={280} />
        <button onClick={copyAndOpenWallet} style={{ marginTop: '10px' }}>
          Copy & Open Wallet
        </button>
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
              value={donationAmount}
              onChange={handleChangeAmount}
              className='slider'
            />
          </div>

          <div className='amount'>
            <p>Amount: {donationAmount} </p>
          </div>

          <div className='amount-buttons'>
            {predefinedAmounts.map((amount, index) => (
              <button key={index} onClick={() => handleSelectAmount(amount)}>
                {amount} ZEC
              </button>
            ))}
          </div>

          <div className='input-number'>
            <label>Enter Amount (ZEC):</label>
            <input
              type='number'
              value={memo}
              placeholder='Enter Amount in ZEC'
              onChange={handleChangeMemo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationComp;
