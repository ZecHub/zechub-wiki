import React from "react";
import QRCode from "qrcode.react";

interface QRCodeComponentProps {
  memo: string;
  className?: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ memo, className }) => {
  // Base64 URL Encoding function
  const base64UrlEncode = (input: string): string => {
    const base64Encoded = btoa(unescape(encodeURIComponent(input)));
    return base64Encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  // Generate Zcash Payment URI
  const generateMessageLink = (): string => {
    const zcashAddress =
      "zcash:u1hu6m28c4xkufyftytug30wvaknajs2dqdy0nvh4yz9xq854p3chxv8per9rdsdyt7ycaeddp7u5xgmn3ghvkh4sku785fy4m5vgqsv0r";
    const baseAmount = 0.05; // Example base amount in ZEC

    const encodedMemo = base64UrlEncode(memo);

    return `${zcashAddress}?amount=${baseAmount}&memo=${encodedMemo}`;
  };

  return (
    <div
      className={`flex flex-col items-center p-4 border rounded-lg bg-white ${className}`}
      onClick={() => window.open(generateMessageLink(), "_blank")}
    >
      <QRCode value={generateMessageLink()} size={180} />
      <p className="mt-2 text-sm text-gray-600">Tap QR to send payment</p>
    </div>
  );
};

export default QRCodeComponent;
