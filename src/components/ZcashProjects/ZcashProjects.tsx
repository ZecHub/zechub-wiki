"use client";
import { ChangeEvent, useState } from "react";
import QRCode from "qrcode.react";
import Image from "next/image";
import zcashLogo from "../../../public/zcash-logo.png";
import ycashLogo from "../../../public/ycash-logo.png";
import namadaLogo from "../../../public/namada-logo.png";
import penumbraLogo from "../../../public/penumbra-logo.png";
import Grid from "../Grid/Grid";
import "./zcashProjects.css";

// Function to convert string to Base64 URL-safe format
const toBase64Url = (str: string) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // Remove any padding characters (=)
};

const ZcashProjectsComp = () => {
  return (
    <div className="zcash-projects-container">
      <h1>Zcash Projects</h1>
      <Grid />
    </div>
  );
};

export default ZcashProjectsComp;
