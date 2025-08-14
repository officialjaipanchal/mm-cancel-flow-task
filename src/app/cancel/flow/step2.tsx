'use client';

import { useState } from 'react';
import styles from './flow.module.css';

interface Step2Props {
  onBack: () => void;
  onContinue: (feedback: string) => void;
  onClose: () => void;
}

export default function Step2({ onBack, onContinue, onClose }: Step2Props) {
  const [feedback, setFeedback] = useState('');
  const minCharacters = 25;
  const currentCharacters = feedback.length;
  const isContinueDisabled = currentCharacters < minCharacters;

  const handleContinue = () => {
    if (!isContinueDisabled) {
      onContinue(feedback);
    }
  };

  return (
    <div className={styles['flow-modal-overlay']}>
      <div className={styles['flow-modal']}>
        {/* Header */}
        <div className={styles['flow-modal-header']}>
          <button 
            onClick={onBack}
            className={styles['flow-back-button-desktop']}
          >
            <svg className={styles['flow-back-icon-desktop']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h1 className={styles['flow-modal-title']}>
            Subscription Cancellation
            <div className={styles['flow-progress']}>
              <div className={styles['flow-progress-bars']}>
                <div className={`${styles['flow-progress-bar']} ${styles['completed']}`}></div>
                <div className={`${styles['flow-progress-bar']} ${styles['active']}`}></div>
                <div className={styles['flow-progress-bar']}></div>
              </div>
              <span className={styles['flow-progress-text']}>Step 2 of 3</span>
            </div>
          </h1>
          
          <button 
            onClick={onClose}
            className={styles['flow-close-button']}
            aria-label="Close modal"
          >
            <svg className={styles['flow-close-icon']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
                </div>
        <button 
          onClick={onBack}
          className={styles['flow-back-button']}
        >
          <svg className={styles['flow-back-icon']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Content */}
        <div className={styles['flow-modal-content']}>
          {/* Left side - Form content */}
          <div className={styles['flow-form-section']}>
            <div className={styles['flow-form-content']}>
              {/* Question */}
              <div className={styles['flow-question']}>
                <h3 className={styles['flow-question-title']}>
                  What's one thing you wish we could've helped you with?
                </h3>
                <p className={styles['flow-question-subtitle']}>
                  We're always looking to improve, your thoughts can help us make Migrate Mate more useful for others.*
                </p>
                
                <div className={styles['flow-textarea-container']}>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts..."
                    className={styles['flow-textarea']}
                    rows={6}
                  />
                  <div className={styles['flow-character-counter']}>
                    Min {minCharacters} characters ({currentCharacters}/{minCharacters})
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className={styles['flow-actions']}>
                <button
                  onClick={handleContinue}
                  disabled={isContinueDisabled}
                  className={`${styles['flow-continue-button']} ${isContinueDisabled ? styles['disabled'] : ''}`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className={styles['flow-image-section']}>
            <img 
              src="/empire-state-compressed.jpg" 
              alt="New York City Skyline at dusk with Empire State Building and city lights" 
              className={styles['flow-hero-image']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
