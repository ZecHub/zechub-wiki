"use client";

import React from 'react';
import { TransactionStageData } from './stageData';

interface TransactionStageProps {
  stage: TransactionStageData;
}

export const TransactionStage: React.FC<TransactionStageProps> = ({ stage }) => {
  return (
    <div className="stage-content">
      <div className="stage-header">
        <h2 className="stage-title">{stage.title}</h2>
        <p className="stage-description">{stage.description}</p>
      </div>

      {/* Transaction Visualization */}
      <div className="transaction-flow">
        {/* From Address */}
        <div className="transaction-node">
          <div className={`address-box ${stage.from.includes('t') ? 'transparent' : 'shielded'}`}>
            {stage.from.includes('t') ? '👁️' : '🔒'}
          </div>
          <p className="address-label">{stage.from}</p>
        </div>

        {/* Arrow with Amount */}
        <div className="transaction-arrow">
          <div className={`amount-badge ${stage.color}`}>
            {stage.shielded ? '???' : stage.amount}
          </div>
          <div className="arrow-icon">→</div>
          <div className={`privacy-badge ${stage.color}`}>
            {stage.privacy}
          </div>
        </div>

        {/* To Address */}
        <div className="transaction-node">
          <div className={`address-box ${stage.to.includes('t') ? 'transparent' : 'shielded'}`}>
            {stage.to.includes('t') ? '👁️' : '🔒'}
          </div>
          <p className="address-label">{stage.to}</p>
        </div>
      </div>

      {/* Shielded Info */}
      <div className={`transaction-info ${stage.shielded ? 'shielded' : 'public'}`}>
        <p className="info-text">
          {stage.shielded 
            ? '🔒 Shielded Transaction - Details are private' 
            : '👁️ Public Transaction - All details visible on blockchain'}
        </p>
      </div>
    </div>
  );
};