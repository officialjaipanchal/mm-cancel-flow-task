'use client';

import styles from './flow-looking.module.css';

interface CompletionProps {
  onBackToJobs: () => void;
  onClose: () => void;
}

export default function Completion({ onBackToJobs, onClose }: CompletionProps) {
  return (
    <div className={styles['flow-modal-overlay']}>
      <div className={styles['flow-modal']}>
        {/* Header */}
        <div className={styles['flow-modal-header']}>
          <div className={styles['flow-completion-header']}>
            <div className={styles['flow-completion-center']}>
              <span className={styles['flow-completion-title']}>Subscription Cancelled</span>
              <div className={styles['flow-completion-progress']}>
                <div className={styles['flow-progress-bars']}>
                  <div className={`${styles['flow-progress-bar']} ${styles['completed']}`}></div>
                  <div className={`${styles['flow-progress-bar']} ${styles['completed']}`}></div>
                  <div className={`${styles['flow-progress-bar']} ${styles['completed']}`}></div>
                </div>
                <span className={styles['flow-progress-text']}>Completed</span>
              </div>
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
              {/* Main Message */}
              <div className={styles['flow-greeting']}>
                <h2 className={styles['flow-greeting-title']}>
                  Sorry to see you go, mate. <br /><br />
                  <p>Thanks for being with us, and you're always welcome back.</p>
                </h2>
                
                  
              </div>
              
              {/* Subscription Details */}
              <div className={styles['flow-subscription-details']}>
                <p className={styles['flow-subscription-text']}>
                  <b>Your subscription is set to end on XX date. You'll still have full access until then. No further charges after that.</b>
                </p>
                <p className={styles['flow-subscription-text']}>
                  Changed your mind? You can reactivate anytime before your end date.
                </p>
              </div>

              {/* Back to Jobs Button */}
              <div className={styles['flow-actions']}>
                <div className={styles['flow-divider']}></div>
                <button
                  onClick={onBackToJobs}
                  className={styles['flow-finish-button']}
                >
                  Back to Jobs
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
