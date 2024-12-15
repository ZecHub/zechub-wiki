"use client";

import useConnect from "@/hooks/penumbra/useConnect";
import useInfo from "@/hooks/penumbra/useInfo";
import { useWalletManifests } from "@/hooks/penumbra/useWalletManifests";
import { AddressViewComponent } from "@penumbra-zone/ui/AddressView";

import { truncateString } from "@/lib/penumbra/format";
import { useEffect } from "react";
import "./penumbra.css";

export default function PenumbraWalletConnect() {
  const { manifest: wallets, loading: loadingManifest } = useWalletManifests();
  const { connected, loading, onConnect, onDisconnect } = useConnect();
  const { address, balances } = useInfo(connected);

  useEffect(() => {
    // Access the DOM and truncate the address once it's rendered
    const addressElement = document.querySelector(".truncate");

    if (addressElement) {
      const text = addressElement.textContent; // Get the full text of the rendered address
      const truncatedText = truncateString(text!, 20); // Truncate it
      addressElement.textContent = truncatedText; // Update the DOM with the truncated text
    }
  }, [address]); // Run effect when the address changes

  return (
    <div className={`${connected && "p-board"}`}>
      {!loading && !connected && (
        <ul>
          {!Object.keys(wallets).length && (
            <p className="p-text" style={{ padding: "12px", margin: "12px" }}>
              No injected wallet found. Try{" "}
              <span>
                <a
                  className="underline"
                  href="https://chromewebstore.google.com/detail/prax-wallet/lkpmkhpnhknhmibgnmmhdhgdilepfghe"
                  target="_blank"
                >
                  installing Prax
                </a>
              </span>
            </p>
          )}

          {Object.entries(wallets).map(([origin, mainfest]) => (
            <button
              key={origin}
              onClick={() => onConnect(origin)}
              disabled={loadingManifest}
              className="p-btn"
            >
              {loadingManifest ? "Connecting" : `Connect to ${mainfest.name}`}
            </button>
          ))}
        </ul>
      )}

      {loading && (
        <div className={`${loading && "p-board"}`}>
          <p className="p-text">Wallet loading...</p>
        </div>
      )}

      {connected && (
        <section className="p-section">
          <div className="p-info">
            <p className="p-text">
              Address:
              <span>
                {address && (
                  <AddressViewComponent addressView={address} truncate={true} />
                )}
              </span>
            </p>
            <div className="p-balance">
              <h4>Balance{balances.length === 0 && ": 0"} </h4>
              {balances.length > 0 && (
                <ul>
                  {balances.map((bal, i) => (
                    // <WalletBalance key={i} balance={bal} />
                    <li key={i}>
                      {String(balances[0].balanceView?.valueView.value)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button onClick={onDisconnect} className="p-btn">
            Disconnect
          </button>
        </section>
      )}
    </div>
  );
}
