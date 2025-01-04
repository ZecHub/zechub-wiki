import React, { useState } from "react";
import styles from "./NewsletterForm.module.css";

const NewsletterForm: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"ecosystemnews" | "networkstats" | null>(null);
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (!address) {
      alert("Please enter your Zcash unified address.");
      return;
    }

    const optionName = selectedOption === "ecosystemnews" ? "Ecosystem News" : "Network Stats";
    alert(`Your address has been submitted for ${optionName}.`);
    setAddress(""); // Clear the input field after submission
  };

  return (
    <div className={styles.container}>
      <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
      <div className={styles.buttons}>
        <button
          onClick={() => setSelectedOption("ecosystemnews")}
          className={`${styles.button} ${selectedOption === "ecosystemnews" ? styles.active : ""}`}
        >
          Ecosystem News
        </button>
        <button
          onClick={() => setSelectedOption("networkstats")}
          className={`${styles.button} ${selectedOption === "networkstats" ? styles.active : ""}`}
        >
          Network Stats
        </button>
      </div>
      {selectedOption && (
        <div className={styles.form}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your Zcash unified address"
            className={styles.input}
          />
          <button onClick={handleSubmit} className={styles.submit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;
