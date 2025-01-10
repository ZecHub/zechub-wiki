"use client";

import React, { useState } from "react";
import QRCodeComponent from "./QRCodeComponent"; // Import your QRCodeComponent

const Newsletter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [unifiedAddress, setUnifiedAddress] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Ecosystem News");
  const [paymentUri, setPaymentUri] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    if (!unifiedAddress || !selectedCategory) {
      alert("Please enter a Unified Address and select a category.");
      setLoading(false);
      return;
    }

    try {
      // Construct the memo based on the selected category
      const memo = `${selectedCategory} | Address: ${unifiedAddress}`;

      // Base64 URL encode the memo
      const base64UrlEncode = (input: string) => {
        const base64Encoded = btoa(unescape(encodeURIComponent(input)));
        return base64Encoded
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      };

      const encodedMemo = base64UrlEncode(memo);

      // Define the Zcash payment URI
      const zcashAddress =
        "zcash:u1w2xxkpqq84j09rku9s3nsu7q0w2s8l2ducurgmuq0ezp97cdp7ku7pdfst6npw7sgqc4zat6tawvcqhwfde7zsvwcn4l87h8l2h484uukj2t6yh72zk96uapwvvclkctuvg0rpjkda4vwg34gl2sxlk6r27qztuqlz7zf7d2x9ycyh9g0mlhn64ey026fes4l0alxf7cx8d4un8ret9";
      const amount = "0.05"; // Example amount in ZEC
      const uri = `${zcashAddress}?amount=${amount}&memo=${encodedMemo}`;

      // Save the generated URI to state
      setPaymentUri(uri);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error generating payment URI:", error);
      alert("An error occurred. Please try again.");
    }
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
          <QRCodeComponent prefix="ZecHub" memo={paymentUri} encrypt={false} fec={false} />
          <p className="text-sm text-gray-500 mt-2">
            Scan the QR code or click it to complete your payment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
