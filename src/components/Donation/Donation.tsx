"use client";
import Image from "next/image";
import QRCode from "qrcode.react";
import { ChangeEvent, useState } from "react";
import namadaLogo from "../../../public/namada-logo.png";
import penumbraLogo from "../../../public/penumbra-logo.png";
import ycashLogo from "../../../public/ycash-logo.png";
import zcashLogo from "../../../public/zcash-logo.png";
import PenumbraWalletConnect from "../Penumbra/PenumbraWalletConnect";
import "./donation.css";

// Function to convert string to Base64 URL-safe format
const toBase64Url = (str: string) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // Remove any padding characters (=)
};

const DonationComp = () => {
  const [donationAmount, setDonationAmount] = useState(1); // Default donation amount
  const [memo, setMemo] = useState(""); // Memo for the donation
  const [selectedCurrency, setSelectedCurrency] = useState("zcash"); // Track selected currency
  const [error, setError] = useState<string | null>(null); // Error state for invalid input

  const zcashAddress =
    "zcash:u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89";
  const ycashAddress =
    "ys1t2e77wawylp8zky7wq3gzky2j4w6rpgd8632vmvqqj370thgpls8t973qutj4gn5wsc3qmcy56y";
  const namadaAddress =
    "znam1qp9v3gvs6dx576wx938kns0xx5ancxgv7z8athjq3gp7qp4uxk9qzdqdwqycpkyp0emtlsg9wlzzr";
  const penumbraDonationAddress =
    "penumbra1mrjsg0kggcsxt3qn839tzahraa669jrpxh47ejry0twnph2328pjmlzg65z4em8u8xl8g3k6k4tdspvdmk5vxtjcwv4ssd3cagpg9a6xntfxe8yvdch0xm9eaq550yaffwvgqv";

  const handleSelectAmount = (amount: string) => {
    setDonationAmount(parseFloat(amount));
    setMemo(""); // Clear memo when a predefined amount is selected
    setError(null); // Clear error on valid selection
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount greater than 0");
    } else {
      setDonationAmount(value);
      setMemo(""); // Clear memo if donation amount is changed
      setError(null); // Clear error if input is valid
    }
  };

  const handleAmountButton = (value: number) => {
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount greater than 0");
    } else {
      setDonationAmount(value);
      setMemo(""); // Clear memo if donation amount is changed
      setError(null); // Clear error if input is valid
    }
  };

  const handleChangeMemo = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length > 512) {
      setError("Memo exceeds the maximum allowed length of 512 characters.");
    } else {
      setMemo(value);
      setError(null); // Clear error when memo length is valid
    }
  };

  const generateDonationLink = () => {
    if (error) return ""; // Return empty if there's an error
    const formattedAmount = parseFloat(donationAmount.toString()).toFixed(4); // Format amount to four decimal places
    let address = "";
    let encodedMemo = memo ? toBase64Url(memo) : "";
    let donationLink = "";

    switch (selectedCurrency) {
      case "zcash":
        address = zcashAddress;
        donationLink = `${address}?amount=${formattedAmount}&memo=${encodeURIComponent(
          encodedMemo
        )}`;
        break;
      case "ycash":
        address = ycashAddress;
        donationLink = `${address}?amount=${formattedAmount}&memo=${encodeURIComponent(
          encodedMemo
        )}`;
        break;
      case "namada":
        address = namadaAddress;
        donationLink = `${address}?amount=${formattedAmount}&memo=${encodeURIComponent(
          encodedMemo
        )}`;
        break;
      case "penumbra":
        // Special format for Penumbra using pcli send syntax
        address = penumbraDonationAddress;
        donationLink = `pcli tx send ${formattedAmount}penumbra --to ${address}`;
        break;
      default:
        address = "";
    }

    return donationLink;
  };

  const copyAndOpenWallet = async () => {
    // Generate donation link and copy it
    const donationLink = generateDonationLink();
    navigator.clipboard.writeText(donationLink).then(
      () => {
        alert("Address copied to clipboard!");
        window.location.href = donationLink; // Attempt to open the link with the default wallet application
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="donation-container donation-border">
      <div style={{ margin: "20px auto", textAlign: "center" }}>
        <QRCode value={generateDonationLink()} size={280} />
        <button onClick={copyAndOpenWallet} style={{ marginTop: "10px" }}>
          Copy & Open Wallet
        </button>
      </div>

      {/* Currency buttons */}
      <div
        className="currency-switch"
        style={{ marginTop: "5px", display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={() => setSelectedCurrency("zcash")}
          className={selectedCurrency === "zcash" ? "active" : ""}
          style={{
            borderRadius: "50%",
            padding: "10px",
            margin: "5px",
            border:
              selectedCurrency === "zcash"
                ? "3px solid lightblue"
                : "3px solid transparent",
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={zcashLogo} alt="Zcash" width={32} height={32} />
        </button>

        <button
          onClick={() => setSelectedCurrency("ycash")}
          className={selectedCurrency === "ycash" ? "active" : ""}
          style={{
            borderRadius: "50%",
            padding: "10px",
            margin: "5px",
            border:
              selectedCurrency === "ycash"
                ? "3px solid lightblue"
                : "3px solid transparent",
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={ycashLogo} alt="Ycash" width={32} height={32} />
        </button>

        <button
          onClick={() => setSelectedCurrency("namada")}
          className={selectedCurrency === "namada" ? "active" : ""}
          style={{
            borderRadius: "50%",
            padding: "10px",
            margin: "5px",
            border:
              selectedCurrency === "namada"
                ? "3px solid lightblue"
                : "3px solid transparent",
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={namadaLogo} alt="Namada" width={32} height={32} />
        </button>

        <button
          onClick={() => setSelectedCurrency("penumbra")}
          className={selectedCurrency === "penumbra" ? "active" : ""}
          style={{
            borderRadius: "50%",
            padding: "10px",
            margin: "5px",
            border:
              selectedCurrency === "penumbra"
                ? "3px solid lightblue"
                : "3px solid transparent",
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={penumbraLogo} alt="Penumbra" width={32} height={32} />
        </button>
      </div>

      {/* Slider */}
      <div
        className="donation-slider"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <label>Donation Amount:</label>
        <input
          className="new-input-size"
          type="range"
          min={0.1}
          max={5.0}
          step={0.1}
          value={donationAmount}
          onChange={handleChangeAmount}
        />
        <div className="new-value-buttons">
          <button onClick={() => handleAmountButton(0.5)}>0.5</button>
          <button onClick={() => handleAmountButton(1.0)}>1.0</button>
          <button onClick={() => handleAmountButton(2.0)}>2.0</button>
          <button onClick={() => handleAmountButton(5.0)}>5.0</button>
        </div>
        <p>
          {donationAmount}{" "}
          {selectedCurrency === "penumbra"
            ? "PENUMBRA"
            : selectedCurrency.toUpperCase()}
        </p>
      </div>

      {/* Memo */}
      <div
        className="donation-memo"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <label>Memo (Optional):</label>
        <textarea
          value={memo}
          onChange={handleChangeMemo}
          maxLength={512}
          rows={4}
          placeholder="Add a memo (Optional, max 512 characters)"
        />
        <div style={{ textAlign: "right", fontSize: "12px", color: "gray" }}>
          {memo.length}/512
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <PenumbraWalletConnect />
    </div>
  );
};

export default DonationComp;
