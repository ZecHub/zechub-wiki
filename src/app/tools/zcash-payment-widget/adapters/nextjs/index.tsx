"use client";

import { ZcashPaymentURI } from "../react";
import { ZcashPaymentURIConfig } from "../types";


interface Props extends Omit<ZcashPaymentURIConfig, "target"> {}

export function ZcashPaymentURINextJs(props: Props) {
  return (
    <ZcashPaymentURI
      address={props.address}
      amount={props.amount}
      apiBase={props.apiBase}
      disabled={props.disabled}
      label={props.label}
      theme={props.theme}
    />
  );
}
