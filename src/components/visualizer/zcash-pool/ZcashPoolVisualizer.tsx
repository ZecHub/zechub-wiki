"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { PoolStage } from './PoolStage';
import { TransactionStage } from './TransactionStage';
import { StageData, stages } from './stageData';
import './index.css';

const ZcashPoolVisualizer: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentStage < stages.length - 1) {
              setCurrentStage(c => c + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStage]);

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setCurrentStage(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const stage = stages[currentStage];

  return (
    <div className="visualizer-container">
      <div className="visualizer-wrapper">
        {/* Header */}
        <div className="visualizer-header">
          <h1 className="visualizer-title">
            Zcash Shielded Pool Visualizer
          </h1>
          <p className="visualizer-subtitle">
            Interactive guide to Zcash privacy pools and transactions
          </p>
        </div>

        {/* Main Visualization Area */}
        <div className="visualizer-main">
          {/* Stage Counter */}
          <div className="stage-counter">
            <span className="stage-label">
              Stage {currentStage + 1} of {stages.length}
            </span>
            <div className="stage-indicators">
              {stages.map((_, idx) => (
                <div
                  key={idx}
                  className={`stage-dot ${
                    idx === currentStage 
                      ? 'active' 
                      : idx < currentStage 
                      ? 'completed' 
                      : 'inactive'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content Area */}
          {stage.type === 'transaction' ? (
            <TransactionStage stage={stage} />
          ) : (
            <PoolStage stage={stage} />
          )}

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-container">
          <button
            onClick={handlePrev}
            disabled={currentStage === 0}
            className="control-btn secondary"
            aria-label="Previous stage"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="control-btn primary"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={handleReset}
            className="control-btn secondary"
            aria-label="Reset to beginning"
          >
            <RotateCcw size={20} />
            Reset
          </button>

          <button
            onClick={handleNext}
            disabled={currentStage === stages.length - 1}
            className="control-btn secondary"
            aria-label="Next stage"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Info Footer */}
        <div className="visualizer-footer">
          <p>💡 Best Practice: Always use z→z transactions for maximum privacy</p>
        </div>
      </div>
    </div>
  );
};

export default ZcashPoolVisualizer;