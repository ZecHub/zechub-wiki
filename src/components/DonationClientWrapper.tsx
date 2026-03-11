'use client';

import { useState } from 'react';
import DonationComp from "@/components/Donation/Donation";
import ZcashUAZArt from './ZcashUAZArt';

const DonationClientWrapper = () => {
  const [showZArt, setShowZArt] = useState(true);

  // ================== SLIDER COLOR ==================
  const sliderColor = '#00A3FF';           // ← Change this line
  // ZecHub colors you can use:
  // Blue:  '#00A3FF'  (recommended)
  // Green: '#00FF9F'
  // Gold:  '#F4B400'  (original orange)
  // ===============================================

  return (
    <>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '40px', 
        fontSize: '2.3rem' 
      }}>
        Donate to ZecHub
      </h1>

      {/* Nice Slider Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '45px'
      }}>
        <label style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={showZArt}
            onChange={() => setShowZArt(!showZArt)}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '220px',
            height: '22px',
            background: '#99ccff',
            borderRadius: '50px',
            position: 'relative',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            {/* Sliding knob — color controlled by the variable above */}
            <div style={{
              position: 'absolute',
              top: '6px',
              left: showZArt ? '6px' : 'calc(100% - 25px)',
              width: '20px',
              height: '10px',
              background: sliderColor,
              borderRadius: '50px',
              transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 4px 12px ${sliderColor}80`
            }} />

            {/* Labels */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 30px',
              fontSize: '15.5px',
              fontWeight: '600',
              zIndex: 2,
              pointerEvents: 'none'
            }}>
              <span style={{ color: !showZArt ? '#111' : '#111' }}>
                v0
              </span>
              <span style={{ color: showZArt ? '#111' : '#111' }}>
                v1
              </span>
            </div>
          </div>
        </label>
      </div>

      {showZArt ? <ZcashUAZArt /> : <DonationComp />}
    </>
  );
};

export default DonationClientWrapper;