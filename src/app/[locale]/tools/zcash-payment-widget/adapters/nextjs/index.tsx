"use client";

import { ZcashPaymentURI } from "../react";
import { ZcashPaymentURIConfig } from "../types";


interface Props extends Omit<ZcashPaymentURIConfig, "target"> {}

export function ZcashPaymentURINextJs(props: Props) {
  return <ZcashPaymentURI {...props} />;
}
