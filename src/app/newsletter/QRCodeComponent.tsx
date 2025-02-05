import React from "react";
import QRCode from "qrcode.react";

interface QRCodeComponentProps {
  memo: string;
  address: string;
  amount: number;
  className?: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ memo, address, amount, className }) => {
  // Base64 URL Encoding function
  const base64UrlEncode = (input: string): string => {
    const base64Encoded = btoa(unescape(encodeURIComponent(input)));
    return base64Encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  // Generate Zcash Payment URI using provided props
  const generateMessageLink = (): string => {
    const encodedMemo = base64UrlEncode(memo);
    return `zcash:${address}?amount=${amount}&memo=${encodedMemo}`;
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
