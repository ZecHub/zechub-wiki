"use client";

import React, { useState } from "react";

const ZecToZatsConverter: React.FC = () => {
  const [zec, setZec] = useState<number | "">("");
  const [zats, setZats] = useState<number | "">("");

  const handleZecChange = (value: string) => {
    const zecValue = parseFloat(value);
    if (!isNaN(zecValue)) {
      setZec(zecValue);
      setZats(zecValue * 100_000_000); // 1 ZEC = 100,000,000 Zats
    } else {
      setZec("");
      setZats("");
    }
  };

  return (
    <div
      style={{
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "20px auto",
        textAlign: "center",
      }}
      className="dark:bg-gray-800 dark:text-white"
    >
      <h3>ZEC to Zats Converter</h3>
      <input
        type="number"
        value={zec}
        onChange={(e) => handleZecChange(e.target.value)}
        placeholder="Enter ZEC"
        style={{
          width: "calc(100% - 20px)",
          padding: "10px",
          margin: "10px 0",
          border: "1px solid #ddd",
          borderRadius: "5px",
          fontSize: "16px",
        }}
        className="dark:bg-gray-700 dark:text-white"
      />
      <input
        type="text"
        value={zats === "" ? "" : zats.toLocaleString()}
        placeholder="Equivalent in Zats"
        readOnly
        style={{
          width: "calc(100% - 20px)",
          padding: "10px",
          margin: "10px 0",
          border: "1px solid #ddd",
          borderRadius: "5px",
          fontSize: "16px",
        }}
        className="dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

export default ZecToZatsConverter;
