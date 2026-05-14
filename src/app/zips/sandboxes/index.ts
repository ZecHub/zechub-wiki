import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface SandboxEntry {
  zip: number;
  Component: ComponentType;
  pendingPeerReview: boolean;
  peerReviewNote?: string;
}

const lazy = (loader: () => Promise<{ default: ComponentType }>) =>
  dynamic(loader, { ssr: false });

export const SANDBOXES: Record<number, SandboxEntry> = {
  226: {
    zip: 226,
    Component: lazy(() => import("./Sandbox226")),
    pendingPeerReview: true,
    peerReviewNote: "Cryptography review needed for anonymity-set framing.",
  },
  227: {
    zip: 227,
    Component: lazy(() => import("./Sandbox227")),
    pendingPeerReview: true,
    peerReviewNote: "Issuance fee figure should be re-verified against current spec.",
  },
  230: {
    zip: 230,
    Component: lazy(() => import("./Sandbox230")),
    pendingPeerReview: false,
  },
  231: {
    zip: 231,
    Component: lazy(() => import("./Sandbox231")),
    pendingPeerReview: false,
  },
  233: {
    zip: 233,
    Component: lazy(() => import("./Sandbox233")),
    pendingPeerReview: false,
  },
  234: {
    zip: 234,
    Component: lazy(() => import("./Sandbox234")),
    pendingPeerReview: true,
    peerReviewNote: "Smoothing curve should be matched to the published functional form.",
  },
  235: {
    zip: 235,
    Component: lazy(() => import("./Sandbox235")),
    pendingPeerReview: false,
  },
};

export function hasSandbox(num: number): boolean {
  return num in SANDBOXES;
}
