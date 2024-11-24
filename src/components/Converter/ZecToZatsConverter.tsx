"use client";

import React, { useState } from "react";

const ZecToZatsConverter: React.FC = () => {
  const [zec, setZec] = useState<number | "">("");
  const [zats, setZats] = useState<number | "">("");

  const handleZecChange = (value: string) => {
    const zecValue = parseFloat(value);
    if (!isNaN(zecValue)) {
      setZec(zecValue);
      setZats(zecValue * 1_000_000_000); // 1 ZEC = 1,000,000,000 Zats
    } else {
      setZec("");
      setZats("");
    }
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "20px auto",
        textAlign: "center",
      }}
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
          backgroundColor: "#f9f9f9",
        }}
      />
    </div>
  );
};

export default ZecToZatsConverter;
