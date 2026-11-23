import React from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { buildZip321Uri } from "@/lib/zip321";

const NEWSLETTER_ADDRESS =
  "u1n6sscrlxhz8a9wlvfa076rux7q00lff48jt62kje09ds5ntynlp2hcrsf3emtprts3z59yt99cvzwvnz7lvzgrpdxqrj3kxfx98y2pt46qry87rqcfuj02x3xsj0jqqnehhzd8hy090tntqwsx8ncatsckzmnw43yqqntuv668av4vhqf2p6payrz94cstm2v465f4nllmpawp5jcat";
const DEFAULT_AMOUNT_ZEC = 0.05;
const OPTION_FEE_ZEC = 0.05;
const ZATOSHI_PER_ZEC = 100_000_000;

export interface QRCodeComponentProps {
  amount?: number;
  prefix?: string;
  memo?: string;
  encrypt?: boolean;
  fec?: boolean;
  className?: string;
  /** Request a canvas when the caller needs to export this QR as a PNG. */
  canvasRef?: React.Ref<HTMLCanvasElement>;
}

export function buildNewsletterPaymentUri({
  amount = DEFAULT_AMOUNT_ZEC,
  prefix = "",
  memo = "",
  encrypt = false,
  fec = false,
}: Pick<
  QRCodeComponentProps,
  "amount" | "prefix" | "memo" | "encrypt" | "fec"
>): string {
  let totalZatoshis = Math.round(amount * ZATOSHI_PER_ZEC);
  if (encrypt) totalZatoshis += Math.round(OPTION_FEE_ZEC * ZATOSHI_PER_ZEC);
  if (fec) totalZatoshis += Math.round(OPTION_FEE_ZEC * ZATOSHI_PER_ZEC);
  const totalAmount = totalZatoshis / ZATOSHI_PER_ZEC;

  const flags = `${encrypt ? "e1" : "e0"} ${fec ? "f1" : "f0"}`;
  const trimmedPrefix = prefix.trim();
  const combinedInfo = trimmedPrefix ? `${trimmedPrefix} ${flags}` : flags;
  const trimmedMemo = memo.trim();
  const fullMemo = trimmedMemo ? `${combinedInfo} | ${trimmedMemo}` : combinedInfo;

  return buildZip321Uri([
    {
      address: NEWSLETTER_ADDRESS,
      amount: totalAmount,
      memo: fullMemo,
    },
  ]);
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  amount,
  prefix,
  memo,
  encrypt,
  fec,
  className,
  canvasRef,
}) => {
  const paymentUri = buildNewsletterPaymentUri({
    amount,
    prefix,
    memo,
    encrypt,
    fec,
  });

  return (
    <div
      className={`flex flex-col items-center p-4 border rounded-lg bg-white${className ? ` ${className}` : ""}`}
      onClick={() => window.open(paymentUri, "_blank")}
    >
      {canvasRef ? (
        <QRCodeCanvas ref={canvasRef} value={paymentUri} size={180} />
      ) : (
        <QRCodeSVG value={paymentUri} size={180} />
      )}
      <p className="mt-2 text-sm text-gray-600">Tap QR to send payment</p>
    </div>
  );
};

export default QRCodeComponent;
