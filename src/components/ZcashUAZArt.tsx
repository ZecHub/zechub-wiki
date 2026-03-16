'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';

export default function ZcashUAZArt() {
  const [copied, setCopied] = useState(false);

  const ua = "u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u5533c97affg9jq208du0vf787vfx4vkd6cd0ma4pxkkuc6xe6ue4dlgjvn9dhzacgk9peejwxdn0ksw3v3yf0dy47znruqftfqgf6xpuelle29g2qxquudxsnnen3dvdx8az6w3tggalc4pla3n4jcs8vf4h29ach3zd8enxulush89";
  const zArt = 
  `   u1rl2zw85dmjc8m4dmqvtstcyvdjn23n0ad53u
   5533c97affg9jq208du0vf787vfx4vkd6cd0ma
                                    4pxk
                                  kuc6
                                xe6u
                              e4dl
                            gjvn
                          9dhz
                        acgk
                      9pee
                    jwxd
                  n0ks
                w3v3
              yf0d
            y47z
          nruq
        ftfq
      gf6xpuelle29g2qxquudxsnnen3dvdx8az6w3t
      ggalc4pla3n4jcs8vf4h29ach3zd8enxulush89`;

  const copyUA = () => {
    navigator.clipboard.writeText(ua);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px 0' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '1.85rem' }}>
        Zcash Unified Address – Shielded by Default
      </h3>

      {/* SINGLE BLACK BOX containing BOTH QR + Z */}
      <div style={{
        background: '#111',
        border: '5px solid #F4B400',
        borderRadius: '24px',
        padding: '50px 1px',
        display: 'inline-block',
        boxShadow: '0 20px 55px rgba(244, 180, 0, 0.4)',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* QR Code centered at the top of the box */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <QRCode
            value={ua}
            size={240}
            level="H"
            fgColor="#00FF9F" //FFCC00 or F4B400 or 00A3FF or 00FF9F
            bgColor="#111"
            style={{ display: 'inline-block', padding: '22px', background: '#111', borderRadius: '12px', border: '6px solid #F4B400' }}
          />
        </div>

        {/* Your Z art directly below the QR */}
        <pre style={{
          fontFamily: 'monospace',
          padding: '1px 20px',
          fontSize: '12px',
          lineHeight: '1.08',
          letterSpacing: '0.1px',
          color: '#F4B400',
          margin: 0,
          whiteSpace: 'pre',
          overflowX: 'auto',
          textAlign: 'left'
        }}>
          {zArt}
        </pre>
      </div>

      {/* Copy button below the entire box */}
      <button
        onClick={copyUA}
        style={{
          display: 'block',
	  margin: '35px auto 0',
          padding: '16px 42px',
          fontSize: '17px',
          backgroundColor: '#F4B400',
          color: '#111',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        {copied ? '✅ Copied!' : '📋 Copy Full Unified Address'}
      </button>
    </div>
  );
}
