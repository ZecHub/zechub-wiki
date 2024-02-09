'use client';
import './donation.css';
import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const DonationComp = () => {
  const [donationAmount, setDonationAmount] = useState(10); // Default donation amount
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
    const formattedAmount = parseFloat(donationAmount).toFixed(2); // Format amount to two decimal places
    const paypalDonationLink = `https://www.paypal.com/donate/?amount=${formattedAmount}&currency=USD`;
    const cryptoWalletAddress = 'your-crypto-wallet-address'; // Replace with your crypto wallet address
    const combinedDonationLinks = `PayPal: ${paypalDonationLink}\nCrypto Wallet: ${cryptoWalletAddress}\nMemo: ${memo}`;
    return combinedDonationLinks;
  };

  return (
    <div className='donation-container'>
      <div className='zcash-image'>
        <img src="../../../../Zcashcard.png" />
      </div>
      <div className='donation-slider'>
        <div className='donation-header'>
        <h1>Donate Now</h1>
        <p>The goal of ZecHub is to provide an educational platform where community members can work together on creating, validating, and promoting content that supports the Zcash & Privacy technology ecosystems.</p>
        
        <div className='input-range'>
          <label>Choose your donation amount:</label>
          <input
            type="range"
            min="1"
            max="10000"
            value={donationAmount}
            onChange={handleChangeAmount}
            className="slider"
          />
        </div>

        <div className='amount'>
          <p>Amount: ${donationAmount}</p>
        </div>

        <div className='amount-buttons'>
          {predefinedAmounts.map((amount, index) => (
            <button key={index} onClick={() => handleSelectAmount(amount)}>
              ${amount}
            </button>
          ))}
        </div>
        
        <div className='input-number'>
          <label>Or Enter Amount:</label>
          <input
            type="number"
            value={memo}
            placeholder="Enter Amount Here"
            onChange={handleChangeMemo}
          />
        </div>

       
        </div>
       

        <br />
        <div style={{ width: '300px' }}> {/* Adjust the width as needed */}
          <QRCode value={generateDonationLink()} size={280} /> {/* Adjust the size as needed */}
        </div>
      </div>
    </div>
  );
};

export default DonationComp;
