'use client';

import styles from './flow-looking.module.css';

interface OfferAccepted2Props {
  onClose: () => void;
}

export default function OfferAccepted2({ onClose }: OfferAccepted2Props) {
  return (
    <div className={styles['flow-modal-overlay']}>
      <div className={styles['flow-modal']}>
        {/* Header */}
        <div className={styles['flow-modal-header']}>
          <div className={styles['flow-completion-header']}>
            <div className={styles['flow-completion-center']}>
              <span className={styles['flow-completion-title']}>Subscription</span>
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
                  Awesome - we've pulled together a few roles that seem like a great fit for you.
                </h2>
                <p className={styles['flow-greeting-subtitle']}>
                  Take a look and see what sparks your interest.
                </p>
              </div>
              
              {/* Job Card */}
              <div className={styles['flow-job-card']}>
                {/* Header */}
                <div className={styles['flow-job-header']}>
                  <div className={styles['flow-job-company-section']}>
                    <div className={styles['flow-job-logo']}>
                      <span className={styles['flow-job-logo-inner']}>R</span>
                    </div>
                    <div className={styles['flow-job-title-section']}>
                      <h2 className={styles['flow-job-title']}>Automation Controls Engineer</h2>
                      <p className={styles['flow-job-company']}>Randstad USA • Memphis, Tennessee</p>
                    </div>
                  </div>
                  <div className={styles['flow-job-tags']}>
                    <span className={styles['flow-job-tag']}>Full Time</span>
                    <span className={styles['flow-job-tag']}>Associate</span>
                    <span className={styles['flow-job-tag']}>Bachelor's</span>
                    <span className={styles['flow-job-tag']}>On-Site</span>
                  </div>
                </div>

                {/* Salary and Visa Info */}
                <div className={styles['flow-job-salary-section']}>
                  <div className={styles['flow-job-salary-left']}>
                    <span className={styles['flow-job-status']}>NEW JOB</span>
                    <div className={styles['flow-job-salary']}>$150,000/yr - $170,000/yr</div>
                  </div>

                  {/* Visa Info */}
                  <div className={styles['flow-job-visa']}>
                    <p className={styles['flow-job-visa-title']}>Visas sponsored by company in the last year</p>
                    <div className={styles['flow-job-visa-stats']}>
                      <span className={styles['visa-pill']}>
                        <span className={styles['visa-icon']}>🟢</span>
                        <span className={styles['visa-text']}>Green Card</span>
                        <span className={styles['visa-badge']}>205</span>
                      </span>
                      <span className={styles['visa-pill']}>
                        <span className={styles['visa-text']}>AU E-3</span>
                        <span className={styles['visa-badge']}>1</span>
                      </span>
                      <span className={styles['visa-pill']}>
                        <span className={styles['visa-text']}>CA/MX TN</span>
                        <span className={styles['visa-badge']}>+</span>

                      </span>
                      <span className={styles['visa-pill']}>
                        <span className={styles['visa-icon']}>🎓</span>
                        <span className={styles['visa-text']}>OPT</span>
                        <span className={styles['visa-badge']}>+</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className={styles['flow-job-description']}>
                  <p>
                    The Electrical Automation Controls Engineer will design, implement, and maintain industrial automation systems, specializing in PLC programming using Siemens TIA Portal. The ideal candidate should have a Bachelor's degree in Electrical Engineering and at least 4 years of industrial automation experience. This role offers autonomy and is ideal for someone seeking growth in a supportive company. Key benefits include comprehensive healthcare and retirement plans.
                  </p>
                </div>

                {/* Contact and Actions */}
                <div className={styles['flow-job-actions']}>
                  <div className={styles['flow-job-contact']}>
                    Company visa contact: <span className={styles['flow-job-email']}>barbara.tuck@randstadusa.com</span>
                  </div>
                  

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles['flow-job-feedback-icon']}
                  >
                    <path d="M2.75 4.75a2 2 0 0 1 1-1h12.4a2 2 0 0 1 2 2v6.4a2 2 0 0 1-2 2h-3.75l-2.5 2.75-2.5-2.75H4.75a2 2 0 0 1-2-1v-6.5z" />
                    <path d="M10 6.5v3.5" />
                    <circle cx="10" cy="11.75" r="0.75" fill="currentColor" stroke="none" />
                  </svg>

                  
                  <button className={styles['flow-job-save-button']}>Save Job</button>
                  <button className={styles['flow-job-apply-button']}>Apply</button>
                </div>
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
