"use client";
import { ChangeEvent, useState } from "react";
import QRCode from "qrcode.react";
import Image from "next/image";
import zcashLogo from "../../../public/zcash-logo.png";
import ycashLogo from "../../../public/ycash-logo.png";
import namadaLogo from "../../../public/namada-logo.png";
import penumbraLogo from "../../../public/penumbra-logo.png";
import Row from "../Row/Row";
import "./brand.css";

// Function to convert string to Base64 URL-safe format
const toBase64Url = (str: string) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // Remove any padding characters (=)
};

const BrandComp = () => {
  return (
    <div className="zcash-projects-container">
      <div className="text-center">
        <h1 className="dark:text-slate-100 text-slate-800">Brand</h1>
        <p className="dark:text-slate-400 text-slate-800 text-lg">
          Download of Brand Asset Folders are accessible to site visitors.{" "}
          <a
            href="/downloads/brand/Midia Kit Ecossistema Zcash.zip"
            download="brand.zip"
          >
            Click Here
          </a>
        </p>
      </div>
      <Row />
    </div>
  );
};

export default BrandComp;
