import React, { useState } from "react";
import styles from "./NewsletterForm.module.css";

const NewsletterForm = () => {
  const [selectedOption, setSelectedOption] = useState<"ecosystemnews" | "networkstats" | null>(null);
  const [address, setAddress] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleSubmit = () => {
    if (!address) {
      alert("Please enter your Zcash unified address.");
      return;
    }

    const optionName = selectedOption === "ecosystemnews" ? "Ecosystem News" : "Network Stats";
    setConfirmationMessage(`Your address has been submitted for ${optionName}.`);
    setAddress(""); // Clear the input field after submission
  };

  return (
    <div className={styles.container}>
      <h1>Sign Up to the Shielded Newsletter</h1>
      <p>🔒 Why Join? Stay informed...</p>
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
      {confirmationMessage && <p className={styles.confirmation}>{confirmationMessage}</p>}
    </div>
  );
};

export default NewsletterForm;
