"use client";
import Image from "next/image";
import QRCode from "qrcode.react";
import { useState, useEffect } from "react";
import PenumbraWalletConnect from "../Penumbra/PenumbraWalletConnect";
import "./donation.css";
import { BsQrCodeScan } from "react-icons/bs";
import { MdOutlineCopyAll } from "react-icons/md";

type Token = "zcash" | "penumbra" | "ycash" | "namada" | "dash";
type Symbol = "zec" | "um" | "yec" | "nam" | "dash";

const images = {
  zcash: "/donation-isometric/i4_zcash_-_isometric.png",
  namada: "/donation-isometric/i2_Namada_-_Isometric.png",
  ycash: "/donation-isometric/i3_Ycash_-_Isometric.png",
  penumbra: "/donation-isometric/i1_Penumbra_-_Isometric.png",
  dash: "/donation-isometric/i5_Dash_-_Isometric.png",
};

const DonationComp = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Token>("zcash");
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>("zec");
  const [imgLogo, setImgLogo] = useState(images.zcash);
  const [imgFade, setImgFade] = useState(false);
  const [isPenumbraVisible, setIsPenumbraVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const zcashAddress =
    "u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89";
  const ycashAddress =
    "ys1t2e77wawylp8zky7wq3gzky2j4w6rpgd8632vmvqqj370thgpls8t973qutj4gn5wsc3qmcy56y";
  const namadaAddress =
    "znam1qp9v3gvs6dx576wx938kns0xx5ancxgv7z8athjq3gp7qp4uxk9qzdqdwqycpkyp0emtlsg9wlzzr";
  const penumbraDonationAddress =
    "penumbra1jy08usn0vmp05amty8d74c3xt5kv4dg36snzql9ndp2xefmvk3fwmrzytrfdpvxduaak8t76gsdggtgtscd26tknjnkwkxh8us3pprjv0nknmkqmx9h4xermdsw3dl7ev36sx7";
  const dashAddress = ""; // TODO: add shielded Dash address

  useEffect(() => {
    setIsPenumbraVisible(selectedCurrency === "penumbra");
  }, [selectedCurrency]);

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
      case "dash":
        return dashAddress;
      default:
        return "";
    }
  };

  const handleOnClick = (tokenName: Token) => {
    setImgFade(true);
    let tokenSymbol: Symbol;

    switch (tokenName) {
      case "zcash":
        tokenSymbol = "zec";
        break;
      case "penumbra":
        tokenSymbol = "um";
        break;
      case "ycash":
        tokenSymbol = "yec";
        break;
      case "dash":
        tokenSymbol = "dash";
        break;
      default:
        tokenSymbol = "nam";
    }

    setTimeout(() => {
      setSelectedSymbol(tokenSymbol);
      setSelectedCurrency(tokenName);
      setImgLogo(images[tokenName]);
      setImgFade(false);
    }, 400);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currencies: { id: Token; label: string; logo: string }[] = [
    { id: "zcash", label: "Zcash", logo: "/zcash-logo.png" },
    { id: "ycash", label: "Ycash", logo: "/ycash-logo.png" },
    { id: "namada", label: "Namada", logo: "/namada-logo.png" },
    { id: "penumbra", label: "Penumbra", logo: "/penumbra-logo.png" },
    { id: "dash", label: "Dash", logo: "/dash-logo.png" },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-[90vh] px-4 pt-8 pb-12 gap-10">
      {/* Currency selector */}
      <div className="w-full max-w-[720px] bg-gray-100 dark:bg-gray-800/80 rounded-full p-1.5 flex flex-wrap justify-center gap-1 shadow-sm">
        {currencies.map((c) => {
          const isActive = selectedCurrency === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleOnClick(c.id)}
              className={`
                flex items-center justify-center gap-2
                px-4 py-2.5 rounded-full text-sm font-medium
                transition-all duration-200 ease-out
                min-w-[110px]
                ${
                  isActive
                    ? "bg-[#1984c7] text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <Image
                src={c.logo}
                alt={c.label}
                width={22}
                height={22}
                className="shrink-0"
              />
              <span className="hidden sm:inline">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* QR + Address card */}
      <div className="w-full max-w-[520px] flex flex-col items-center gap-5">
        <div className="relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#1984c7] flex items-center justify-center shadow-md">
            <BsQrCodeScan color="white" size={18} />
          </div>

          <div className="mt-2 mb-1">
            <QRCode
              value={getDonationAddress() || " "}
              size={280}
              level="M"
              includeMargin={false}
              bgColor="transparent"
              fgColor="currentColor"
              className="text-gray-900 dark:text-white"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 uppercase tracking-wider">
            {selectedCurrency} address
          </p>
        </div>

        {/* Address + copy */}
        <div className="w-full relative">
          <div className="flex items-stretch gap-2">
            <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 shadow-sm overflow-hidden">
              <p className="text-[13px] font-mono text-gray-800 dark:text-gray-200 break-all leading-relaxed select-all">
                {getDonationAddress() || "Address coming soon…"}
              </p>
            </div>

            <button
              onClick={() => handleCopy(getDonationAddress())}
              disabled={!getDonationAddress()}
              className="shrink-0 w-12 rounded-xl bg-[#1984c7] hover:bg-[#1573b0] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
              title="Copy address"
            >
              <MdOutlineCopyAll color="white" size={20} />
            </button>
          </div>

          {copied && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md animate-fade-in-out whitespace-nowrap">
              Copied to clipboard
            </div>
          )}
        </div>
      </div>

      {/* Penumbra special case (kept for compatibility) */}
      {isPenumbraVisible && (
        <div className="w-full max-w-[520px]">
          <PenumbraWalletConnect />
        </div>
      )}
    </div>
  );
};

export default DonationComp;