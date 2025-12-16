"use client";

import React from 'react';
import { PoolStageData } from './stageData';

interface PoolStageProps {
  stage: PoolStageData;
}

export const PoolStage: React.FC<PoolStageProps> = ({ stage }) => {
  return (
    <div className="stage-content">
      <div className="stage-header">
        <div className="stage-icon">{stage.icon}</div>
        <h2 className="stage-title">{stage.title}</h2>
        <p className="stage-description">{stage.description}</p>
      </div>

      {/* Address Example */}
      <div className="address-example">
        <p className="address-label">Address Format:</p>
        <p className="address-value">{stage.addressExample}</p>
      </div>

      {/* Privacy Level */}
      <div className={`privacy-level ${stage.color}`}>
        <p className="privacy-label">Privacy Level</p>
        <p className="privacy-value">{stage.privacy}</p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {stage.features.map((feature, idx) => (
          <div key={idx} className="feature-item">
            <p className="feature-text">✓ {feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};