import React, { useState } from "react";
import styles from "./NewsletterForm.module.css"; // Assuming custom styles are added here

const NewsletterForm: React.FC = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [unifiedAddress, setUnifiedAddress] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleForm = (formType: string) => {
    setActiveForm((prev) => (prev === formType ? null : formType));
    setMessage(null);
    setError(null);
    setUnifiedAddress(""); // Reset the input field when toggling
  };

  const handleSubmit = async (type: string) => {
    if (!unifiedAddress.trim()) {
      setError("Unified address cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/api/newsletter/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unifiedAddress }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Successfully signed up!");
        setUnifiedAddress(""); // Clear the input field
      } else {
        setError(result.error || "Failed to sign up. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up to the Shielded Newsletter</h1>
      <p className={styles.description}>
        🔒 <b>Why Join?</b>
        <br />
        Stay informed and connected, directly in your Zcash shielded wallet. With our newsletter, you can:
        <br />
        <br />
        <b>Ecosystem News:</b> Get a concise weekly summary of notable updates, upcoming events, and community highlights—delivered straight to your shielded memo.
        <br />
        <b>Network Stats:</b> Stay updated on key Zcash network metrics, including supply, transfers, approximate node counts, transactions, and shielded usage statistics—all in one weekly snapshot.
        <br />
        <br />
        ✨ Reimagine Your Wallet: Your wallet isn't just for transactions anymore. It's now a hub for secure, meaningful updates.
        <br />
        🛠️ Empower Your Community: We're also working on tools to let you create your own shielded newsletters, enabling more users to explore the potential of private, wallet-based communication.
        <br />
        <br />
        📬 Sign Up Now: Enter a unified address and choose the updates that matter most to you. Let’s redefine how we stay connected while protecting our privacy.
      </p>

      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${activeForm === "networkstats" ? styles.active : ""}`}
          onClick={() => toggleForm("networkstats")}
        >
          Network Stats
        </button>
        <button
          className={`${styles.button} ${activeForm === "ecosystemnews" ? styles.active : ""}`}
          onClick={() => toggleForm("ecosystemnews")}
        >
          Ecosystem News
        </button>
      </div>

      {activeForm && (
        <div className={styles.form}>
          <label htmlFor="unifiedAddress" className={styles.label}>
            Enter your Zcash Unified Address:
          </label>
          <input
            type="text"
            id="unifiedAddress"
            value={unifiedAddress}
            onChange={(e) => setUnifiedAddress(e.target.value)}
            placeholder="Enter your Zcash Unified Address"
            className={styles.input}
          />
          <button
            className={styles.submitButton}
            onClick={() => handleSubmit(activeForm)}
          >
            Submit
          </button>
          {message && <p className={styles.success}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;
