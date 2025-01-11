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
      "zcash:u1n6sscrlxhz8a9wlvfa076rux7q00lff48jt62kje09ds5ntynlp2hcrsf3emtprts3z59yt99cvzwvnz7lvzgrpdxqrj3kxfx98y2pt46qry87rqcfuj02x3xsj0jqqnehhzd8hy090tntqwsx8ncatsckzmnw43yqqntuv668av4vhqf2p6payrz94cstm2v465f4nllmpawp5jcat";
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
