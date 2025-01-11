"use client";

import React, { useState } from "react";
import QRCodeComponent from "./QRCodeComponent";

const Newsletter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [unifiedAddress, setUnifiedAddress] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Ecosystem News");
  const [paymentUri, setPaymentUri] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!unifiedAddress || !selectedCategory) {
      alert("Please enter a Unified Address and select a category.");
      return;
    }

    const memo = `${selectedCategory} | Address: ${unifiedAddress}`;
    setPaymentUri(memo);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] bg-gray-100 dark:bg-slate-900 p-4">
      <h1 className="text-2xl font-bold mb-4">ZecHub Shielded Newsletter</h1>
      <p className="text-gray-700 mb-6">
        Subscribe to updates by entering your Unified Address.
      </p>
      <div className="space-y-4 md:space-x-4 space-x-2">
        <button
          onClick={() => setSelectedCategory("Ecosystem News")}
          className={`md:px-6 px-2 py-2 font-semibold rounded-lg ${
            selectedCategory !== "Ecosystem News"
              ? "bg-gray-200"
              : "bg-[#1984c7] text-white"
          }`}
        >
          Ecosystem News
        </button>
        <button
          onClick={() => setSelectedCategory("Network Stats")}
          className={`md:px-6 px-4 py-2 font-semibold rounded-lg ${
            selectedCategory !== "Network Stats"
              ? "bg-gray-200"
              : "bg-[#1984c7] text-white"
          }`}
        >
          Network Stats
        </button>
      </div>
      <input
        type="text"
        placeholder="Enter your Unified Address"
        value={unifiedAddress}
        onChange={(e) => setUnifiedAddress(e.target.value)}
        className="w-full max-w-md mt-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Subscribe"}
      </button>

      {paymentUri && (
        <div className="mt-6">
          <QRCodeComponent memo={paymentUri} />
        </div>
      )}
    </div>
  );
};

export default Newsletter;
