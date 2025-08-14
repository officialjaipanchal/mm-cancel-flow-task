'use client';

import styles from './flow-looking.module.css';

interface OfferAcceptedProps {
  onClose: () => void;
  abTestingData?: any;
}

export default function OfferAccepted({ onClose, abTestingData }: OfferAcceptedProps) {
  return (
    <div className={styles['flow-modal-overlay']}>
      <div className={styles['flow-modal']}>
        {/* Header */}
        <div className={styles['flow-modal-header']}>
          <div className={styles['flow-completion-header']}> 
            <div className={styles['flow-completion-center']}>
              <span className={styles['flow-completion-title']}>
                <span className={styles['flow-completion-title-desktop']}>Subscription</span>
                <span className={styles['flow-completion-title-mobile']}>Subscription Continued</span>
              </span>
              
              <div className={styles['flow-completion-divider']}></div>
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

        {/* Content */}
        <div className={styles['flow-modal-content']}>
          {/* Left side - Content */}
          <div className={styles['flow-form-section']}>
            <div className={styles['flow-form-content']}>
              {/* Headline */}
              <div className={styles['flow-greeting']}>
                <h2 className={styles['flow-greeting-title']}>
                  Great choice, mate!
                </h2>
                <p className={styles['flow-greeting-subtitle']}>
                  You're still on the path to your dream role. <span className={styles['flow-highlight']}>Let's make it happen together!</span>
                </p>
              </div>
              
              {/* Subscription Details */}
              <div className={styles['flow-subscription-details']}>
                <p className={styles['flow-subscription-text']}>
                  You've got XX days left on your current plan.
                </p>
                <p className={styles['flow-subscription-text']}>
                  Starting from XX date, your monthly payment will be ${abTestingData?.discountedPrice ? parseFloat(abTestingData.discountedPrice).toFixed(2) : '12.50'}.
                </p>
                <p className={styles['flow-subscription-disclaimer']}>
                  You can cancel anytime before then.
                </p>
              </div>

              {/* Finish Button */}
              <div className={styles['flow-actions']}>
                <button
                  className={styles['flow-finish-button']}
                >
                  Land your dream role
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
