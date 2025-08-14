'use client';

import { useState, useEffect } from 'react';
import { DataService } from '../../../lib/dataService';
import type { ABTestingData } from '../../../lib/dataService';
import styles from './flow-looking.module.css';

interface Step1Props {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onAcceptOffer: (abData?: any) => void;
}

export default function Step1({ onNext, onBack, onClose, onAcceptOffer }: Step1Props) {
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

  if (loading) {
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
                  <div className={`${styles['flow-progress-bar']} ${styles['active']}`}></div>
                  <div className={styles['flow-progress-bar']}></div>
                  <div className={styles['flow-progress-bar']}></div>
                </div>
                <span className={styles['flow-progress-text']}>Step 1 of 3</span>
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
            <div className={styles['flow-loading-container']}>
              <div className={styles['flow-loading']}>
                <div className={styles['flow-loading-spinner']}>
                  <svg className={styles['flow-loading-icon']} fill="none" viewBox="0 0 24 24">
                    <circle className={styles['flow-loading-circle']} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className={styles['flow-loading-path']} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className={styles['flow-loading-title']}>Loading your pricing information...</h2>
                <p className={styles['flow-loading-message']}>Please wait while we retrieve your subscription details.</p>
                <div className={styles['flow-loading-dots']}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['flow-modal-overlay']}>
        <div className={styles['flow-modal']}>
          <div className={styles['flow-modal-header']}>
            <h1 className={styles['flow-modal-title']}>Loading...</h1>
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
          
          <h1 className={styles['flow-modal-title']}>
            Subscription Cancellation
            <div className={styles['flow-progress']}>
              <div className={styles['flow-progress-bars']}>
                <div className={`${styles['flow-progress-bar']} ${styles['active']}`}></div>
                <div className={styles['flow-progress-bar']}></div>
                <div className={styles['flow-progress-bar']}></div>
              </div>
              <span className={styles['flow-progress-text']}>Step 1 of 3</span>
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
          {/* Left side - Content */}
          <div className={styles['flow-form-section']}>
            <div className={styles['flow-form-content']}>
              {/* Main Heading */}
              <div className={styles['flow-greeting']}>
                <h2 className={styles['flow-greeting-title']}>
                  We built this to help you land the job, this makes it a little easier.
                </h2>
                <p className={styles['flow-greeting-subtitle']}>
                  We've been there and we're here to help you.
                </p>
              </div>
              
              {/* Offer Box */}
              <div className={styles['flow-offer-card']}>
                <h3 className={styles['flow-offer-title']}>
                  {abTesting && abTesting.variant === 'A' ? (
                    <>
                      Here's <span className={styles['flow-offer-highlight']}>50% off</span> until you find a job.
                    </>
                  ) : abTesting && abTesting.variant === 'B' && abTesting.originalPrice && abTesting.discountedPrice ? (
                    <>
                      Here's <span className={styles['flow-offer-highlight']}>${(abTesting.originalPrice - abTesting.discountedPrice).toFixed(2)} off</span> until you find a job.
                    </>
                  ) : (
                    <>
                      Here's <span className={styles['flow-offer-highlight']}>50% off</span> until you find a job.
                    </>
                  )}
                </h3>
                <div className={styles['flow-offer-pricing']}>
                  <span className={styles['flow-offer-price']}>
                    ${(abTesting?.discountedPrice && !isNaN(abTesting.discountedPrice) ? abTesting.discountedPrice : 12.50).toFixed(2)}/month
                  </span>
                  <span className={styles['flow-offer-original']}>
                    ${(abTesting?.originalPrice && !isNaN(abTesting.originalPrice) ? abTesting.originalPrice : 25).toFixed(2)}/month
                  </span>
                </div>

                <button 
                  onClick={handleAcceptOffer}
                  className={styles['flow-offer-button']}
                >
                  {abTesting && abTesting.variant === 'A' ? 'Get 50% off' : 
                   abTesting && abTesting.variant === 'B' && abTesting.originalPrice && abTesting.discountedPrice ? 
                   `Get $${(abTesting.originalPrice - abTesting.discountedPrice).toFixed(2)} off` : 
                   'Get 50% off'}
                </button>
                <p className={styles['flow-offer-disclaimer']}>
                  You wont be charged until your next billing date.
                </p>
                
              </div>

              {/* No Thanks Button */}
              <div className={styles['flow-actions']}>
                <button
                  onClick={onNext}
                  className={styles['flow-no-thanks-button']}
                >
                  No thanks
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className={`${styles['flow-image-section']} ${styles['flow-image-section-step1']}`}>
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
