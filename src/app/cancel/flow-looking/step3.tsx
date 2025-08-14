'use client';

import { useState, useEffect } from 'react';
import { validateCancellationData, sanitizeInput, validatePrice } from '../../../lib/validation';
import { DataService } from '../../../lib/dataService';
import type { ABTestingData } from '../../../lib/dataService';
import styles from './flow-looking.module.css';

interface Step3Props {
  onComplete: () => void;
  onBack: () => void;
  onClose: () => void;
  onAcceptOffer: (abData?: any) => void;
}

export default function Step3({ onComplete, onBack, onClose, onAcceptOffer }: Step3Props) {
  const [selectedReason, setSelectedReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showError, setShowError] = useState(false);
  const [showReasonError, setShowReasonError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abTesting, setAbTesting] = useState<ABTestingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cancellationReasons = [
    'Too expensive',
    'Platform not helpful',
    'Not enough relevant jobs',
    'Decided not to move',
    'Other'
  ];

  const getFollowUpQuestion = (reason: string) => {
    switch (reason) {
      case 'Too expensive':
        return 'What would be the maximum you would be willing to pay?*';
      case 'Platform not helpful':
        return 'What can we change to make the platform more helpful?*';
      case 'Not enough relevant jobs':
        return 'In which way can we make the jobs more relevant?*';
      case 'Decided not to move':
        return 'What changed for you to decide to not move?*';
      case 'Other':
        return 'What would have helped you the most?*';
      default:
        return '';
    }
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setFeedback('');
    setShowError(false);
    setShowReasonError(false);
  };

  // Load A/B testing data on component mount
  useEffect(() => {
    const loadABTestingData = async () => {
      try {
        // Get user data first to find the active subscription
        const userData = await DataService.getUserData();
        if (userData.subscription) {
          const data = await DataService.getABTestingData(undefined, userData.subscription.id);
          setAbTesting(data);
        }
      } catch (error) {
        console.error('Failed to load A/B testing data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      }
    };

    loadABTestingData();
  }, []);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    // Sanitize input to prevent XSS
    const sanitizedValue = sanitizeInput(e.target.value);
    setFeedback(sanitizedValue);
    setShowError(false);
  };

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

  const handleCompleteCancellation = async () => {
    try {
      setLoading(true);
      setShowError(false);
      setShowReasonError(false);

      // Validate basic input data (reason and downsell variant only)
      const validationResult = validateCancellationData({
        reason: selectedReason,
        downsellVariant: abTesting?.variant || 'A'
      });

      if (!validationResult.isValid) {
        console.error('Initial validation errors:', validationResult.errors);
        setShowError(true);
        return;
      }

      if (!selectedReason) {
        setShowReasonError(true);
        return;
      }
      
      // Additional validation based on reason
      if (selectedReason === 'Too expensive') {
        // For price input, validate as price
        if (!feedback || feedback.trim() === '') {
          setShowError(true);
          return;
        }
        const priceValidation = validatePrice(feedback);
        if (!priceValidation.isValid) {
          console.error('Price validation errors:', priceValidation.errors);
          setShowError(true);
          return;
        }
      } else {
        // For all other reasons, feedback is required with minimum 25 characters
        if (!feedback || feedback.trim() === '') {
          setShowError(true);
          return;
        }
        if (feedback.length < 25) {
          setShowError(true);
          return;
        }
      }

      // Get user data to find the active subscription
      const userData = await DataService.getUserData();
      if (!userData.subscription) {
        throw new Error('No active subscription found');
      }

      // Process cancellation with database
      await DataService.processCancellation({
        userId: userData.subscription.user_id,
        subscriptionId: userData.subscription.id,
        downsellVariant: abTesting?.variant || 'A',
        reason: selectedReason,
        acceptedDownsell: false
      });

      // All validation and database operations passed, proceed with completion
      onComplete();
    } catch (error) {
      console.error('Cancellation processing failed:', error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const characterCount = feedback.length;
  const minCharacters = 25;

  if (error) {
    return (
      <div className={styles['flow-modal-overlay']}>
        <div className={styles['flow-modal']}>
          <div className={styles['flow-modal-header']}>
            <h1 className={styles['flow-modal-title']}>Error</h1>
            <button onClick={onClose} className={styles['flow-close-button']}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={styles['flow-modal-content']}>
            <div className={styles['flow-form-section']}>
              <div className={styles['flow-form-content']}>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-4 px-4 py-2 bg-[#8952fc] text-white rounded-lg hover:bg-[#7b40fc] transition-colors"
                >
                  Back to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <div className={`${styles['flow-progress-bar']} ${styles['completed']}`}></div>
                <div className={`${styles['flow-progress-bar']} ${styles['active']}`}></div>
              </div>
              <span className={styles['flow-progress-text']}>Step 3 of 3</span>
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
                  What's the main reason for cancelling?
                </h2>
                <p className={styles['flow-greeting-subtitle']}>
                  Please take a minute to let us know why:
                </p>
              </div>

              {/* Error message for no reason selected */}
              {showReasonError && (
                <p className={styles['flow-error-text']}>
                  To help us understand your experience, please select a reason for cancelling*
                </p>
              )}
              
              {/* Radio Button Options */}
              <div className={styles['flow-radio-section']}>
                {selectedReason ? (
                  // Show only selected option
                  <label className={styles['flow-radio-option']}>
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={selectedReason}
                      checked={true}
                      onChange={() => {}} // No-op since it's already selected
                    //   className={styles['flow-radio-input']}
                    />
                    <span className={styles['flow-radio-label']}>{selectedReason}</span>
                   
                  </label>
                ) : (
                  // Show all options when none selected
                  cancellationReasons.map((reason) => (
                    <label key={reason} className={styles['flow-radio-option']}>
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => handleReasonSelect(reason)}
                        className={styles['flow-radio-input']}
                      />
                      <span className={styles['flow-radio-label']}>{reason}</span>
                    </label>
                  ))
                )}
              </div>

              {/* Follow-up Question and Input */}
              {selectedReason && (
                <div className={styles['flow-followup-section']}>
                  <h3 className={styles['flow-followup-question']}>
                    {getFollowUpQuestion(selectedReason)}
                  </h3>
                  
                  {selectedReason === 'Too expensive' ? (
                    <div className={styles['flow-price-input-container']}>
                      <span className={styles['flow-price-symbol']}>$</span>
                      <input
                        type="text"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        placeholder="Enter amount"
                        className={styles['flow-price-input']}
                      />
                    </div>
                  ) : (
                    <div className={styles['flow-textarea-container']}>
                      <textarea
                        value={feedback}
                        onChange={handleFeedbackChange}
                        placeholder="Tell us more..."
                        className={styles['flow-textarea']}
                        rows={4}
                      />
                      <div className={styles['flow-character-count']}>
                        Min {minCharacters} characters ({characterCount}/{minCharacters})
                      </div>
                    </div>
                  )}
                  
                  {showError && (
                    <p className={styles['flow-error-text']}>
                      {selectedReason === 'Too expensive' 
                        ? 'Please enter a valid amount*'
                        : 'Please enter at least 25 characters so we can understand your feedback*'
                      }
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles['flow-actions']}>
                <button
                  onClick={handleAcceptOffer}
                  className={styles['flow-offer-button']}
                >
                  {abTesting?.variant === 'A' ? 'Get 50% off' : `Get $${abTesting?.originalPrice ? Math.round(abTesting.originalPrice - abTesting.discountedPrice) : '10'} off`} | ${abTesting?.discountedPrice ? abTesting.discountedPrice.toFixed(2) : '12.50'} <span className={styles['flow-offer-original']}>${abTesting?.originalPrice ? abTesting.originalPrice.toFixed(2) : '25'}</span>
                </button>
                <button
                  onClick={handleCompleteCancellation}
                  className={styles['flow-complete-button']}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Complete cancellation'}
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className={`${styles['flow-image-section']} ${styles['flow-image-section-step3']}`}>
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
