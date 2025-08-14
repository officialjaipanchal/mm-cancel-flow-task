'use client';

import { useState, useEffect } from 'react';
import { DataService } from '../../../lib/dataService';
import type { ABTestingData } from '../../../lib/dataService';
import styles from './flow-looking.module.css';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onAcceptOffer: (abData?: any) => void;
}

export default function Step2({ onNext, onBack, onClose, onAcceptOffer }: Step2Props) {
  const [selectedAnswers, setSelectedAnswers] = useState({
    roles: '',
    emails: '',
    interviews: ''
  });
  const [showError, setShowError] = useState(false);
  const [abTesting, setAbTesting] = useState<ABTestingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load A/B testing data on component mount
  useEffect(() => {
    const loadABTestingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user data first to find the active subscription
        const userData = await DataService.getUserData();
        if (userData.subscription) {
          const data = await DataService.getABTestingData(undefined, userData.subscription.id);
          setAbTesting(data);
        } else {
          throw new Error('No active subscription found');
        }
      } catch (error) {
        console.error('Failed to load A/B testing data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load pricing data');
      } finally {
        setLoading(false);
      }
    };

    loadABTestingData();
  }, []);

  const handleAnswerSelect = (question: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
    setShowError(false);
  };

  const handleContinue = () => {
    if (selectedAnswers.roles && selectedAnswers.emails && selectedAnswers.interviews) {
      onNext();
    } else {
      setShowError(true);
    }
  };

  const isContinueActive = selectedAnswers.roles && selectedAnswers.emails && selectedAnswers.interviews;

  const handleAcceptOffer = async () => {
    try {
      // Get user data to find the active subscription
      const userData = await DataService.getUserData();
      if (!userData.subscription) {
        throw new Error('No active subscription found');
      }

      // Process downsell acceptance with database
      await DataService.processCancellation({
        userId: userData.subscription.user_id,
        subscriptionId: userData.subscription.id,
        downsellVariant: abTesting?.variant || 'A',
        reason: 'User accepted downsell offer',
        acceptedDownsell: true
      });
      
      onAcceptOffer(abTesting);
    } catch (error) {
      console.error('Failed to accept offer:', error);
      setError(error instanceof Error ? error.message : 'Failed to process offer acceptance');
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
          
          <div className={styles['flow-modal-title']}>
            <span>Subscription Cancellation</span>
            <div className={styles['flow-progress']}>
              <div className={styles['flow-progress-bars']}>
                <div className={`${styles['flow-progress-bar']} ${styles['completed']}`}></div>
                <div className={`${styles['flow-progress-bar']} ${styles['active']}`}></div>
                <div className={styles['flow-progress-bar']}></div>
              </div>
              <span className={styles['flow-progress-text']}>Step 2 of 3</span>
            </div>
          </div>
          
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

        {/* Mobile back button and divider */}
        <div className={styles['flow-mobile-divider']}></div>
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
          {/* Left side - Form */}
          <div className={styles['flow-form-section']}>
            <div className={styles['flow-form-content']}>
              {/* Title */}
              <div className={styles['flow-greeting']}>
                <h2 className={styles['flow-greeting-title']}>
                  Help us understand how you were using Migrate Mate.
                </h2>
                {showError && (
                  <div className={styles['flow-error-text']}>
                    <p>Mind letting us know why you're cancelling?</p>
                    <p>It helps us understand your experience and improve the platform.*</p>
                  </div>
                )}
              </div>
              
              {/* Question 1 */}
              <div className={styles['flow-question-section']}>
                <h3 className={styles['flow-question-title']}>
                  How many roles did you apply for through Migrate Mate?
                </h3>
                <div className={styles['flow-answer-options']}>
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect('roles', option)}
                      className={`${styles['flow-answer-option']} ${
                        selectedAnswers.roles === option ? styles['flow-answer-option-selected'] : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className={styles['flow-question-section']}>
                <h3 className={styles['flow-question-title']}>
                  How many companies did you email directly?
                </h3>
                <div className={styles['flow-answer-options']}>
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect('emails', option)}
                      className={`${styles['flow-answer-option']} ${
                        selectedAnswers.emails === option ? styles['flow-answer-option-selected'] : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className={styles['flow-question-section']}>
                <h3 className={styles['flow-question-title']}>
                  How many different companies did you interview with?
                </h3>
                <div className={styles['flow-answer-options']}>
                  {['0', '1-2', '3-5', '5+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect('interviews', option)}
                      className={`${styles['flow-answer-option']} ${
                        selectedAnswers.interviews === option ? styles['flow-answer-option-selected'] : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offer Button */}
              <div className={styles['flow-offer-section']}>
              <button
                  onClick={handleAcceptOffer}
                  className={styles['flow-offer-button']}
                >
                  {abTesting?.variant === 'A' ? 'Get 50% off' : 
                   abTesting?.originalPrice && abTesting?.discountedPrice && !isNaN(abTesting.originalPrice) && !isNaN(abTesting.discountedPrice) ? 
                   `Get $${(abTesting.originalPrice - abTesting.discountedPrice).toFixed(2)} off` : 
                   'Get $10.00 off'} | ${abTesting?.discountedPrice && !isNaN(abTesting.discountedPrice) ? abTesting.discountedPrice.toFixed(2) : '12.50'} <span className={styles['flow-offer-original']}>${abTesting?.originalPrice && !isNaN(abTesting.originalPrice) ? abTesting.originalPrice.toFixed(2) : '25.00'}</span>
                </button>
              </div>

              {/* Continue Button */}
              <div className={styles['flow-actions']}>
                <button
                  onClick={handleContinue}
                  className={`${styles['flow-continue-button']} ${
                    isContinueActive ? styles['flow-continue-button-active'] : ''
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className={`${styles['flow-image-section']} ${styles['flow-image-section-step2']}`}>
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
