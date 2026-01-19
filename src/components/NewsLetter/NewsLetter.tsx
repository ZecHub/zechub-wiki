"use client";

import React, { useState } from "react";
import QRCodeComponent from "@/components/QRComponent/QRCodeComponent";

const NewsLetter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [unifiedAddress, setUnifiedAddress] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Ecosystem News");
  const [isValidAddress, setIsValidAddress] = useState(false);

  // Subscription Data
  const [subscriptionData, setSubscriptionData] = useState<{ memo: string; amount: number } | null>(null);

  // Unsubscribe State
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [unsubscribeAddress, setUnsubscribeAddress] = useState("");
  const [isValidUnsubAddress, setIsValidUnsubAddress] = useState(false);
  const [unsubscribeData, setUnsubscribeData] = useState<{ memo: string; amount: number } | null>(null);

  // Validate Subscription Address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.trim();
    setUnifiedAddress(address);
    setIsValidAddress(/^u|^z/.test(address));
  };

  // Validate Unsubscription Address
  const handleUnsubscribeAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.trim();
    setUnsubscribeAddress(address);
    setIsValidUnsubAddress(/^u|^z/.test(address));
  };

  // Subscribe Function
  const handleSubmit = () => {
    if (!isValidAddress) {
      alert("Please enter a valid shielded Zcash address.");
      return;
    }
    const memoText = `Subscription: ${selectedCategory} | Address: ${unifiedAddress}`;
    // Subscription fee is 0.05 ZEC
    setSubscriptionData({
      memo: memoText,
      amount: 0.05,
    });
  };

  // Unsubscribe Function
  const handleUnsubscribe = () => {
    if (!isValidUnsubAddress) {
      alert("Please enter a valid shielded Zcash address.");
      return;
    }
    const memoText = `UNSUBSCRIBE | Address: ${unsubscribeAddress}`;
    // Unsubscription fee is 0.0001 ZEC
    setUnsubscribeData({
      memo: memoText,
      amount: 0.0001,
    });
  };

  // Function to Download QR Code
  const downloadQRCode = (filename: string) => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = filename;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">ZecHub Shielded Newsletter</h1>
      <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
        Subscribe to updates by entering your Unified Address.
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        A one-time <strong>0.05 ZEC subscription fee</strong> is required to cover transaction costs.
      </p>
      {/* Category Selection Buttons */}
      <div className="space-y-4 md:space-x-4 space-x-2">
        <button
          onClick={() => setSelectedCategory("Ecosystem News")}
          className={`md:px-6 px-4 py-2 font-semibold rounded-lg ${
            selectedCategory !== "Ecosystem News"
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "bg-[#1984c7] text-white"
          }`}
        >
          📰 Ecosystem News
        </button>
        <button
          onClick={() => setSelectedCategory("Network Stats")}
          className={`md:px-6 px-4 py-2 font-semibold rounded-lg ${
            selectedCategory !== "Network Stats"
              ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              : "bg-[#1984c7] text-white"
          }`}
        >
          📊 Network Stats
        </button>
      </div>

      {/* Address Input */}
      <input
        type="text"
        placeholder="Enter your Zcash Unified Address"
        value={unifiedAddress}
        onChange={handleAddressChange}
        className={`w-full max-w-md mt-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-black dark:text-white ${
          isValidAddress ? "focus:ring-green-500 border-green-500" : "focus:ring-red-500 border-red-500"
        }`}
      />
      {unifiedAddress && !isValidAddress && (
        <p className="text-red-500 mt-2 text-sm">
          Invalid address. Must start with &quot;u&quot; or &quot;z&quot;.
        </p>
      )}

      {/* Subscribe Button */}
      <button
        onClick={handleSubmit}
        className={`mt-4 px-6 py-2 font-semibold rounded-lg ${
          isValidAddress
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isValidAddress || loading}
      >
        {loading ? "Generating..." : "Subscribe"}
      </button>

      {/* QR Code Display for Subscription */}
      {subscriptionData && (
        <div className="mt-6 text-center">
          <QRCodeComponent
            amount={subscriptionData.amount}
            memo={subscriptionData.memo}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <strong>Do not edit the memo generated in your wallet.</strong>
          </p>
          <button
            onClick={() => downloadQRCode("subscription_qr.png")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download QR Code
          </button>
        </div>
      )}

      {/* Information Boxes */}
      <div className="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[#1984c7]">What is This Service?</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Receive Zcash ecosystem news and network stats directly via the Zcash network using encrypted memos.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[#1984c7]">How It Works</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We send newsletters once per week to multiple recipients in one shielded transaction using the{" "}
            <strong>z_sendmany</strong> RPC method.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[#1984c7]">How to Receive Updates</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Enter your <strong>shielded Zcash address</strong>. Weekly updates delivered on-chain. No email required.
          </p>
        </div>
      </div>

      {/* Unsubscribe Section (without fee info) */}
      <div className="mt-16">
        <button
          onClick={() => setShowUnsubscribe(!showUnsubscribe)}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
        >
          {showUnsubscribe ? "Cancel Unsubscribe" : "Unsubscribe"}
        </button>
      </div>

      {showUnsubscribe && (
        <div className="mt-6 text-center">
          <input
            type="text"
            placeholder="Enter your Unified Address to unsubscribe"
            value={unsubscribeAddress}
            onChange={handleUnsubscribeAddressChange}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <button
            onClick={handleUnsubscribe}
            className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
            disabled={!isValidUnsubAddress}
          >
            Confirm Unsubscribe
          </button>
          {unsubscribeData && (
            <div className="mt-6">
              <QRCodeComponent
                amount={unsubscribeData.amount}
                memo={unsubscribeData.memo}
              />
              <button
                onClick={() => downloadQRCode("unsubscribe_qr.png")}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsLetter;
