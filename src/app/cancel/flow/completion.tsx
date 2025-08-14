'use client';

import styles from './flow.module.css';

interface CompletionProps {
  onFinish: () => void;
  onClose: () => void;
}

export default function Completion({ onFinish, onClose }: CompletionProps) {
  return (
    <div className={styles['flow-modal-overlay']}>
      <div className={styles['flow-modal']}>
        {/* Header */}
        <div className={styles['flow-modal-header']}>
          <div className={styles['flow-completion-header']}>
            <div className={styles['flow-completion-center']}>
              <span className={styles['flow-completion-title']}>Subscription Cancelled</span>
              <div className={styles['flow-progress']}>
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
          {/* Mobile Image - Shows below progress bars */}
          <div className={styles['flow-mobile-image-section']}>
            <img 
              src="/empire-state-compressed.jpg" 
              alt="New York City Skyline at dusk with Empire State Building and city lights" 
              className={styles['flow-mobile-hero-image']}
            />
          </div>
          
          {/* Left side - Content */}
          <div className={styles['flow-form-section']}>
            <div className={styles['flow-form-content']}>
              {/* Main Headline */}
              <div className={styles['flow-completion-greeting']}>
                <h2 className={styles['flow-completion-title']}>
                  Your cancellation's all sorted, mate, no more charges.
                </h2>
              </div>
              
              {/* Mihailo's Card */}
              <div className={styles['flow-mihailo-card']}>
                <div className={styles['flow-mihailo-header']}>
                  <img 
                    src="/mihailo-profile.jpeg" 
                    alt="Mihailo Bozic" 
                    className={styles['flow-mihailo-avatar']}
                  />
                  <div className={styles['flow-mihailo-info']}>
                    <h3 className={styles['flow-mihailo-name']}>Mihailo Bozic</h3>
                    <p className={styles['flow-mihailo-email']}>mihailo@migratemate.co</p>
                  </div>
                </div>
                <div className={styles['flow-mihailo-message']}>
                  <p className={styles['flow-mihailo-text']}>
                    <b>I'll be reaching out soon to help with the visa side of things.</b>
                  </p>
                  <p className={styles['flow-mihailo-text']}>
                    We've got your back, whether it's questions, paperwork, or just figuring out your options.
                  </p>
                  <p className={styles['flow-mihailo-text']}>
                    Keep an eye on your inbox, I'll be in touch <u>shortly.</u>
                  </p>
                </div>
              </div>
                

             
              {/* Finish Button */}
              <div className={styles['flow-actions']}>
                <button
                  onClick={onFinish}
                  className={styles['flow-finish-button']}
                >
                  Finish
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image (Desktop only) */}
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
