import React, { useState } from "react";
import styles from "./NewsletterForm.module.css";

const NewsletterForm = () => {
  const [selectedOption, setSelectedOption] = useState<"ecosystemnews" | "networkstats" | null>(null);
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    const endpoint =
      selectedOption === "ecosystemnews"
        ? "/api/submit-ecosystemnews"
        : "/api/submit-networkstats";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (response.ok) {
        alert("Address submitted successfully!");
      } else {
        alert("Failed to submit address.");
      }
    } catch (error) {
      alert("Error submitting address.");
    }
  };

  return (
    <div>
      <h1>Sign Up to the Shielded Newsletter</h1>
      <p>🔒 Why Join? Stay informed...</p>
      <div>
        <button
          onClick={() => setSelectedOption("ecosystemnews")}
          className={selectedOption === "ecosystemnews" ? styles.active : ""}
        >
          Ecosystem News
        </button>
        <button
          onClick={() => setSelectedOption("networkstats")}
          className={selectedOption === "networkstats" ? styles.active : ""}
        >
          Network Stats
        </button>
      </div>
      {selectedOption && (
        <div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your Zcash unified address"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;
