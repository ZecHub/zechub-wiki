"use client";
import Image from "next/image";
import QRCode from "qrcode.react";
import { useState, useEffect } from "react";
import PenumbraWalletConnect from "../Penumbra/PenumbraWalletConnect";
import "./donation.css";

// Define token and symbol types for clarity
type Token = "zcash" | "penumbra" | "ycash" | "namada";
type Symbol = "zec" | "um" | "yec" | "nam";

// Import images (using static paths)
const images = {
  zcash: "/donation-isometric/i4_zcash_-_isometric.png",
  namada: "/donation-isometric/i2_Namada_-_Isometric.png",
  ycash: "/donation-isometric/i3_Ycash_-_Isometric.png",
  penumbra: "/donation-isometric/i1_Penumbra_-_Isometric.png"
};

const DonationComp = () => {
  // State for selected currency and its UI details
  const [selectedCurrency, setSelectedCurrency] = useState<Token>("zcash");
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>("zec");
  const [imgLogo, setImgLogo] = useState(images.zcash);
  const [imgFade, setImgFade] = useState(false);
  const [isPenumbraVisible, setIsPenumbraVisible] = useState(false);

  // Static donation addresses
  const zcashAddress =
    "u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89";
  const ycashAddress =
    "ys1t2e77wawylp8zky7wq3gzky2j4w6rpgd8632vmvqqj370thgpls8t973qutj4gn5wsc3qmcy56y";
  const namadaAddress =
    "znam1qp9v3gvs6dx576wx938kns0xx5ancxgv7z8athjq3gp7qp4uxk9qzdqdwqycpkyp0emtlsg9wlzzr";
  const penumbraDonationAddress =
    "penumbra1jy08usn0vmp05amty8d74c3xt5kv4dg36snzql9ndp2xefmvk3fwmrzytrfdpvxduaak8t76gsdggtgtscd26tknjnkwkxh8us3pprjv0nknmkqmx9h4xermdsw3dl7ev36sx7";

  // Update Penumbra-specific UI as needed
  useEffect(() => {
    setIsPenumbraVisible(selectedCurrency === "penumbra");
  }, [selectedCurrency]);

  // Return the donation address based on the selected currency
  const getDonationAddress = () => {
    switch (selectedCurrency) {
      case "zcash":
        return zcashAddress;
      case "ycash":
        return ycashAddress;
      case "namada":
        return namadaAddress;
      case "penumbra":
        return penumbraDonationAddress;
      default:
        return "";
    }
  };

  // Handle clicking on a currency button to update the displayed QR code and image
  const handleOnClick = (tokenName: Token) => {
    setImgFade(true);
    let tokenSymbol: Symbol;
    if (tokenName === "zcash") {
      tokenSymbol = "zec";
    } else if (tokenName === "penumbra") {
      tokenSymbol = "um";
    } else if (tokenName === "ycash") {
      tokenSymbol = "yec";
    } else {
      tokenSymbol = "nam";
    }
    setTimeout(() => {
      setSelectedSymbol(tokenSymbol);
      setSelectedCurrency(tokenName);
      setImgLogo(images[tokenName]);
      setImgFade(false);
    }, 500);
  };

  return (
    <div className="flex justify-evenly mt-24 overflow-hidden">
      <div className="hidden md:block">
        <div id="img-container" className="mt-72">
          {imgLogo && (
            <Image
              src={imgLogo}
              alt={selectedCurrency}
              width={200}
              height={200}
              className={`w-96 h-96 transition-opacity duration-500 ease-in-out ${
                imgFade ? "opacity-0" : "opacity-100"
              }`}
            />
          )}
        </div>
      </div>
      <div className="block">
        <div className="donation-container donation-border">
          <div style={{ margin: "20px auto", textAlign: "center" }}>
            <QRCode value={getDonationAddress()} size={280} />
            {/* Code block displaying the selected donation address */}
            <pre
              className="address-code-block"
              style={{
                width: "320px", // fixed width: slightly wider than the QR code
                textAlign: "left",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                marginTop: "10px",
                overflowX: "auto"
              }}
            >
              <code>{getDonationAddress()}</code>
            </pre>
          </div>

          {/* Currency buttons */}
          <div
            className="currency-switch"
            style={{
              marginTop: "5px",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <button
              onClick={() => handleOnClick("zcash")}
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
                alignItems: "center"
              }}
            >
              <Image src={"/zcash-logo.png"} alt="Zcash" width={32} height={32} />
            </button>

            <button
              onClick={() => handleOnClick("ycash")}
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
                alignItems: "center"
              }}
            >
              <Image src={"/ycash-logo.png"} alt="Ycash" width={32} height={32} />
            </button>

            <button
              onClick={() => handleOnClick("namada")}
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
                alignItems: "center"
              }}
            >
              <Image
                src={"/namada-logo.png"}
                alt="Namada"
                width={32}
                height={32}
              />
            </button>

            <button
              onClick={() => handleOnClick("penumbra")}
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
                alignItems: "center"
              }}
            >
              <Image
                src={"/penumbra-logo.png"}
                alt="Penumbra"
                width={32}
                height={32}
              />
            </button>
          </div>

          {/* Optional: For Penumbra, show wallet connect options */}
          {isPenumbraVisible && (
            <div className="my-10">
              <PenumbraWalletConnect />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationComp;
