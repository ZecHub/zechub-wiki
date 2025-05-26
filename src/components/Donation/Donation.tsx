"use client";
import Image from "next/image";
import QRCode from "qrcode.react";
import { useState, useEffect } from "react";
import PenumbraWalletConnect from "../Penumbra/PenumbraWalletConnect";
import "./donation.css";
import { BsQrCodeScan } from "react-icons/bs";
import { MdOutlineCopyAll } from "react-icons/md";

// Define token and symbol types for clarity
type Token = "zcash" | "penumbra" | "ycash" | "namada";
type Symbol = "zec" | "um" | "yec" | "nam";

// Import images (using static paths)
const images = {
  zcash: "/donation-isometric/i4_zcash_-_isometric.png",
  namada: "/donation-isometric/i2_Namada_-_Isometric.png",
  ycash: "/donation-isometric/i3_Ycash_-_Isometric.png",
  penumbra: "/donation-isometric/i1_Penumbra_-_Isometric.png",
};

const DonationComp = () => {
  // State for selected currency and its UI details
  const [selectedCurrency, setSelectedCurrency] = useState<Token>("zcash");
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>("zec");
  const [imgLogo, setImgLogo] = useState(images.zcash);
  const [imgFade, setImgFade] = useState(false);
  const [isPenumbraVisible, setIsPenumbraVisible] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex md:h-[90vh] h-[100vh] flex-col relative w-full items-center justify-center gap-16 overflow-hidden">
      <div className="md:w-[600px] w-[90%] flex bg- dark:bg-gray-800 shadow-md  rounded-[100px] h-[50px]">
        <div
          onClick={() => handleOnClick("zcash")}
          className={`${
            selectedCurrency === "zcash"
              ? "bg-[#1984c7] shadow-lg"
              : "bg-transparent"
          } flex cursor-pointer gap-2 justify-center items-center w-[150px] h-[50px] rounded-[100px] animate-fade-in-out`}
        >
          <Image src={"/zcash-logo.png"} alt="Zcash" width={32} height={32} />
          <span className="text-white md:block hidden">Zcash</span>
        </div>
        <div
          onClick={() => handleOnClick("ycash")}
          className={`${
            selectedCurrency === "ycash"
              ? "bg-[#1984c7] shadow-lg"
              : "bg-transparent"
          } flex cursor-pointer gap-2 justify-center items-center w-[150px] h-[50px] rounded-[100px] animate-fade-in-out`}
        >
          <Image src={"/ycash-logo.png"} alt="Ycash" width={32} height={32} />
          {selectedCurrency === "ycash" && (
            <span className="text-white md:block hidden">Ycash</span>
          )}
        </div>
        <div
          onClick={() => handleOnClick("namada")}
          className={`${
            selectedCurrency === "namada"
              ? "bg-[#1984c7] shadow-lg"
              : "bg-transparent"
          } flex cursor-pointer gap-2 justify-center items-center w-[150px] h-[50px] rounded-[100px] animate-fade-in-out`}
        >
          <Image src={"/namada-logo.png"} alt="Namada" width={32} height={32} />
          {selectedCurrency === "namada" && (
            <span className="text-white md:block hidden">Namada</span>
          )}
        </div>
        <div
          onClick={() => handleOnClick("penumbra")}
          className={`${
            selectedCurrency === "penumbra"
              ? "bg-[#1984c7] shadow-lg"
              : "bg-transparent"
          } flex cursor-pointer gap-2 justify-center items-center w-[150px] h-[50px] rounded-[100px] animate-fade-in-out`}
        >
          <Image
            src={"/penumbra-logo.png"}
            alt="Penumbra"
            width={32}
            height={32}
          />
          {selectedCurrency === "penumbra" && (
            <span className="text-white md:block hidden">Penumbra</span>
          )}
        </div>
      </div>
      <div className="md:h-[65%] h-[70%] flex-col w-full flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800  relative flex justify-center items-center shadow-md rounded-lg h-full md:w-[600px] w-[90%]">
          <div className="absolute rounded-full left-[50%] -top-[5%] -translate-x-[50%] flex justify-center items-center bg-[#1984c7] w-[50px] h-[50px] shadow-md">
            <BsQrCodeScan color="white" />
          </div>
          <div className="flex justify-center items-center">
            <QRCode value={getDonationAddress()} size={380} />
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center md:w-[600px] w-[90%] h-[50px] mt-6">
          <input
            disabled
            value={getDonationAddress()}
            className="bg-white dark:bg-gray-800 p-2 py-4 relative flex justify-center items-center h-full shadow-lg rounded-lg md:w-[530px] w-[85%]"
          />

          <div
            onClick={() => handleCopy(getDonationAddress())}
            className="w-[50px] cursor-pointer bg-[#1984c7] h-full  flex justify-center items-center rounded-md"
          >
            <MdOutlineCopyAll color="white" size={"20"} />
          </div>
          {copied && (
            <div className="bg-green-500 mt-5 w-full text-white px-3 py-3 rounded-md text-sm animate-fade-in-out">
              Wallet address copied to clipboard!
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-green-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationComp;
