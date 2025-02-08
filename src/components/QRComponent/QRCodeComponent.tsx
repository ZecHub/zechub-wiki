import React from "react";
import QRCode from "qrcode.react";

interface QRCodeComponentProps {
  amount?: number;
  prefix?: string;
  memo?: string;
  encrypt?: boolean;
  fec?: boolean;
  className?: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  prefix,
  memo,
  encrypt,
  fec,
  className,
}) => {
  const base64UrlEncode = (input: string): string => {
    const base64Encoded = btoa(unescape(encodeURIComponent(input)));
    return base64Encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const generateMessageLink = () => {
    const zcashAddress =
      "zcash:u1n6sscrlxhz8a9wlvfa076rux7q00lff48jt62kje09ds5ntynlp2hcrsf3emtprts3z59yt99cvzwvnz7lvzgrpdxqrj3kxfx98y2pt46qry87rqcfuj02x3xsj0jqqnehhzd8hy090tntqwsx8ncatsckzmnw43yqqntuv668av4vhqf2p6payrz94cstm2v465f4nllmpawp5jcat";
    let baseAmount = 0.05; // Example base amount
    if (encrypt) baseAmount += 0.05;
    if (fec) baseAmount += 0.05;

    const formattedAmount = baseAmount.toFixed(2);
    const combinedInfo = `${prefix} ${encrypt ? "e1" : "e0"} ${
      fec ? "f1" : "f0"
    }`.trim();
    const fullMemo = `${combinedInfo} | ${memo}`;
    const encodedMemo = base64UrlEncode(fullMemo);

    return `${zcashAddress}?amount=${formattedAmount}&memo=${encodedMemo}`;
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
