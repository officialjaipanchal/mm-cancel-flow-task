'use client';

import { useState } from 'react';
import styles from './flow.module.css';

interface Step3AltProps {
  onBack: () => void;
  onComplete: (hasImmigrationLawyer: string) => void;
  onClose: () => void;
}

export default function Step3Alt({ onBack, onComplete, onClose }: Step3AltProps) {
  const [hasImmigrationLawyer, setHasImmigrationLawyer] = useState('');
  const [visaType, setVisaType] = useState('');

  const handleComplete = () => {
    if (hasImmigrationLawyer && visaType) {
      onComplete(hasImmigrationLawyer);
    }
  };

  const isContinueDisabled = !hasImmigrationLawyer || !visaType;

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
                <div className={`${styles['flow-progress-bar']} ${styles['completed']}`}></div>
                <div className={`${styles['flow-progress-bar']} ${styles['active']}`}></div>
              </div>
              <span className={styles['flow-progress-text']}>Step 3 of 3</span>
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
              {/* Headline */}

                <h2 className={styles['flow-greeting-title']}>
                You landed the job! <br />
                <i> That's what we live for.</i>
                </h2>
              
              
              {/* Message */}
              <div className={styles['flow-question']}>
                <h3 className={styles['flow-question-title']}>
                Even if it wasn't through Migrate Mate, <br />
                let us help get your visa sorted.
                </h3>
                
              </div>

              {/* Question */}
              <div className={styles['flow-question']}>
                <h3 className={styles['flow-question-title']}>
                  Is your company providing an immigration lawyer to help with your visa?
                </h3>
                {!hasImmigrationLawyer ? (
                  <div className={styles['flow-radio-options']}>
                    <label className={styles['flow-radio-option']}>
                      <input
                        type="radio"
                        name="immigrationLawyer"
                        value="yes"
                        checked={hasImmigrationLawyer === 'yes'}
                        onChange={(e) => setHasImmigrationLawyer(e.target.value)}
                        className={styles['flow-radio-input']}
                      />
                      <span className={styles['flow-radio-label']}>Yes</span>
                    </label>
                    <label className={styles['flow-radio-option']}>
                      <input
                        type="radio"
                        name="immigrationLawyer"
                        value="no"
                        checked={hasImmigrationLawyer === 'no'}
                        onChange={(e) => setHasImmigrationLawyer(e.target.value)}
                        className={styles['flow-radio-input']}
                      />
                      <span className={styles['flow-radio-label']}>No</span>
                    </label>
                  </div>
                ) : (
                  <div className={styles['flow-selected-option']}>
                    <div className={styles['flow-selected-display']}>
                      <div className={styles['flow-radio-selected']}></div>
                      <span className={styles['flow-selected-label']}>
                        {hasImmigrationLawyer === 'yes' ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Conditional Visa Input Field */}
                {hasImmigrationLawyer === 'yes' && (
                  <div className={styles['flow-visa-input']}>
                    <label className={styles['flow-input-label']}>
                      What visa will you be applying for?
                    </label>
                    <input
                      type="text"
                      value={visaType}
                      onChange={(e) => setVisaType(e.target.value)}
                      placeholder="Enter visa type..."
                      className={styles['flow-text-input']}
                    />
                  </div>
                )}

                {hasImmigrationLawyer === 'no' && (
                  <div className={styles['flow-visa-input']}>
                    <p className={styles['flow-help-text']}>
                      We can connect you with one of our trusted partners.
                    </p>
                    <label className={styles['flow-input-label']}>
                      Which visa would you like to apply for?
                    </label>
                    <input
                      type="text"
                      value={visaType}
                      onChange={(e) => setVisaType(e.target.value)}
                      className={styles['flow-text-input']}
                    />
                  </div>
                )}
              </div>

              {/* Complete Button */}
              <div className={styles['flow-actions']}>
                <button
                  onClick={handleComplete}
                  disabled={isContinueDisabled}
                  className={`${styles['flow-continue-button']} ${isContinueDisabled ? styles['disabled'] : ''}`}
                >
                  Complete cancellation
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
