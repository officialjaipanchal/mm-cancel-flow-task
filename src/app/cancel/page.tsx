'use client';

import { useState, useEffect } from 'react';
import { DataService } from '../../lib/dataService';
import type { SubscriptionData, ABTestingData } from '../../lib/dataService';
import styles from './cancel.module.css';

export default function CancelPage() {
  const [isCancelled, setIsCancelled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abTesting, setAbTesting] = useState<ABTestingData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get subscription and A/B testing data
        const data = await DataService.getSubscriptionWithPricing();

        setAbTesting(data.abTesting);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleBack = () => {
    window.location.href = '/';
  };

  const handleCloseModal = () => {
    window.history.back();
  };

  if (isCancelled) {
    return (
      <div className={styles['cancellation-success-container']}>
        <div className={styles['cancellation-success-card']}>
          <div className={styles['cancellation-success-header']}>
            <div className={styles['cancellation-success-icon']}>
              <svg className={styles['cancellation-success-icon-svg']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className={styles['cancellation-success-title']}>Subscription Cancelled</h1>
            <p className={styles['cancellation-success-message']}>
              Your subscription has been cancelled successfully.
            </p>
          </div>
          
          <div className={styles['cancellation-success-content']}>
            <p className={styles['cancellation-success-description']}>
              You will continue to have access to your subscription until the end of your current billing period.
            </p>
            <button
              onClick={handleBack}
              className={styles['cancellation-back-button']}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles['cancellation-back-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles['cancellation-modal-overlay']}>
        <div className={styles['cancellation-modal']}>
          <div className={styles['cancellation-modal-header']}>
            <h1 className={styles['cancellation-modal-title']}>Loading...</h1>
          </div>
          <div className={styles['cancellation-modal-content']}>
            <div className={styles['cancellation-text-section']}>
              <div className={styles['cancellation-text-content']}>
                <div className={styles['cancellation-loading']}>
                  <div className={styles['cancellation-loading-spinner']}>
                    <svg className={styles['cancellation-loading-icon']} fill="none" viewBox="0 0 24 24">
                      <circle className={styles['cancellation-loading-circle']} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className={styles['cancellation-loading-path']} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h2 className={styles['cancellation-loading-title']}>Loading your subscription data...</h2>
                  <p className={styles['cancellation-loading-message']}>Please wait while we retrieve your information.</p>
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
      <div className={styles['cancellation-modal-overlay']}>
        <div className={styles['cancellation-modal']}>
          <div className={styles['cancellation-modal-header']}>
            <h1 className={styles['cancellation-modal-title']}>Error</h1>
            <button 
              onClick={handleCloseModal}
              className={styles['cancellation-close-button']}
              aria-label="Close modal"
            >
              <svg className={styles['cancellation-close-icon']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={styles['cancellation-modal-content']}>
            <div className={styles['cancellation-text-section']}>
              <div className={styles['cancellation-text-content']}>
                <p className={styles['cancellation-description']}>{error}</p>
                <div className={styles['cancellation-actions']}>
                  <button
                    onClick={() => window.location.reload()}
                    className={styles['cancellation-action-button']}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['cancellation-modal-overlay']}>
      <div className={styles['cancellation-modal']}>
        {/* Modal Header */}
        <div className={styles['cancellation-modal-header']}>
          <h1 className={styles['cancellation-modal-title']}>Subscription Cancellation</h1>
          <button 
            onClick={handleCloseModal}
            className={styles['cancellation-close-button']}
            aria-label="Close modal"
          >
            <svg className={styles['cancellation-close-icon']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles['cancellation-modal-content']}>
          {/* Left side - Text content */}
          <div className={styles['cancellation-text-section']}>
            <div className={styles['cancellation-text-content']}>
              <div className={styles['cancellation-greeting']}>
                <h2 className={styles['cancellation-greeting-title']}>
                  Hey mate, <br /> Quick one before you go.
                </h2>
                <p className={styles['cancellation-question']}>
                  Have you found a job yet?
                </p>
              </div>
              
              <p className={styles['cancellation-description']}>
                Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
              </p>

      
            
              <div className={styles['cancellation-actions']}>
                <button
                  onClick={() => window.location.href = '/cancel/flow'}
                  className={styles['cancellation-action-button']}
                >
                  Yes, I've found a job
                </button>
                <button
                  onClick={() => {
                    if (abTesting?.variant === 'B') {
                      window.location.href = '/cancel/flow-looking';
                    } else {
                      window.location.href = '/cancel/flow-looking';
                    }
                  }}
                  className={styles['cancellation-action-button']}
                >
                  Not yet - I'm still looking
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className={styles['cancellation-image-section']}>
            <img 
              src="/empire-state-compressed.jpg" 
              alt="New York City Skyline at dusk with Empire State Building and city lights" 
              className={styles['cancellation-hero-image']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
