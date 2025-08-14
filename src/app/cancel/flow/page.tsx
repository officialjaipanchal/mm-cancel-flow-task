'use client';

import { useState } from 'react';
import styles from './flow.module.css';
import Step2 from './step2';
import Step3 from './step3';
import Step3Alt from './step3-alt';
import Completion from './completion';
import CompletionSimple from './completion-simple';

export default function CancelFlowPage() {
  const [currentStep, setCurrentStep] = useState<number | string>(1);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionType, setCompletionType] = useState<'simple' | 'mihailo'>('simple');
  const [answers, setAnswers] = useState({
    foundJobWithMigrateMate: '',
    rolesApplied: '',
    companiesEmailed: '',
    companiesInterviewed: ''
  });
  const [feedback, setFeedback] = useState('');
  const [hasImmigrationLawyer, setHasImmigrationLawyer] = useState('');

  const handleAnswer = (question: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  const handleStep2Continue = (step2Feedback: string) => {
    setFeedback(step2Feedback);
    // If user found job with MigrateMate, go to step 3, otherwise show alternative step 3
    if (answers.foundJobWithMigrateMate === 'yes') {
      setCurrentStep(3);
    } else {
      setCurrentStep('3-alt');
    }
  };

  const handleStep3Complete = (immigrationLawyer: string) => {
    setHasImmigrationLawyer(immigrationLawyer);
    // Handle final form submission here
    console.log('Final form submitted:', { 
      ...answers, 
      feedback, 
      hasImmigrationLawyer: immigrationLawyer 
    });
    // Show completion page based on selection
    if (immigrationLawyer === 'yes') {
      setCompletionType('simple');
    } else {
      setCompletionType('mihailo');
    }
    setShowCompletion(true);
  };

  const handleStep3AltComplete = (immigrationLawyer: string) => {
    setHasImmigrationLawyer(immigrationLawyer);

    // Handle final form submission for users who didn't find job with MigrateMate
    console.log('Final form submitted (no job found with MigrateMate):', { 
      ...answers, 
      feedback ,
      hasImmigrationLawyer: immigrationLawyer 

    });
    // Show completion page
    if (immigrationLawyer === 'yes') {
        setCompletionType('simple');
      } else {
        setCompletionType('mihailo');
      }
      setShowCompletion(true);
    };
  const handleFinish = () => {
    // Handle finish action - could redirect to home page or close modal
    window.history.back();
  };

  const handleBack = () => {
    if (typeof currentStep === 'number' && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === '3-alt') {
      setCurrentStep(2);
    } else {
      window.history.back();
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  const isContinueDisabled = () => {
    return !answers.foundJobWithMigrateMate || 
           !answers.rolesApplied || 
           !answers.companiesEmailed || 
           !answers.companiesInterviewed;
  };

  return (
    <>
      {showCompletion ? (
        completionType === 'simple' ? (
          <CompletionSimple
            onFinish={handleFinish}
            onClose={handleClose}
          />
        ) : (
          <Completion
            onFinish={handleFinish}
            onClose={handleClose}
          />
        )
      ) : (
        <>
          {currentStep === 1 && (
        <div className={styles['flow-modal-overlay']}>
          <div className={styles['flow-modal']}>
            {/* Header */}
            <div className={styles['flow-modal-header']}>
             
            <button 
                onClick={handleBack}
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
                onClick={handleClose}
                className={styles['flow-close-button']}
                aria-label="Close modal"
              >
                <svg className={styles['flow-close-icon']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
            </div>
            <button 
                onClick={handleBack}
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
                  {/* Greeting */}
                  <div className={styles['flow-greeting']}>
                    <h2 className={styles['flow-greeting-title']}>
                      Congrats on the new role! 🎉 
                    </h2>
                  </div>
                  
                  {/* Question 1 */}
                  <div className={styles['flow-question']}>
                    <h3 className={styles['flow-question-title']}>
                      Did you find this job with MigrateMate?*
                    </h3>
                    <div className={styles['flow-options']}>
                      <button
                        onClick={() => handleAnswer('foundJobWithMigrateMate', 'yes')}
                        className={`${styles['flow-option-button']} ${answers.foundJobWithMigrateMate === 'yes' ? styles['selected'] : ''}`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer('foundJobWithMigrateMate', 'no')}
                        className={`${styles['flow-option-button']} ${answers.foundJobWithMigrateMate === 'no' ? styles['selected'] : ''}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className={styles['flow-question']}>
                    <h3 className={styles['flow-question-title']}>
                      How many roles did you <span className={styles['underlined']}>apply</span> for through Migrate Mate?*
                    </h3>
                    <div className={styles['flow-options']}>
                      <button
                        onClick={() => handleAnswer('rolesApplied', '0')}
                        className={`${styles['flow-option-button']} ${answers.rolesApplied === '0' ? styles['selected'] : ''}`}
                      >
                        0
                      </button>
                      <button
                        onClick={() => handleAnswer('rolesApplied', '1-5')}
                        className={`${styles['flow-option-button']} ${answers.rolesApplied === '1-5' ? styles['selected'] : ''}`}
                      >
                        1 - 5
                      </button>
                      <button
                        onClick={() => handleAnswer('rolesApplied', '6-20')}
                        className={`${styles['flow-option-button']} ${answers.rolesApplied === '6-20' ? styles['selected'] : ''}`}
                      >
                        6 - 20
                      </button>
                      <button
                        onClick={() => handleAnswer('rolesApplied', '20+')}
                        className={`${styles['flow-option-button']} ${answers.rolesApplied === '20+' ? styles['selected'] : ''}`}
                      >
                        20+
                      </button>
                    </div>
                  </div>

                  {/* Question 3 */}
                  <div className={styles['flow-question']}>
                    <h3 className={styles['flow-question-title']}>
                      How many companies did you <span className={styles['underlined']}>email</span> directly?*
                    </h3>
                    <div className={styles['flow-options']}>
                      <button
                        onClick={() => handleAnswer('companiesEmailed', '0')}
                        className={`${styles['flow-option-button']} ${answers.companiesEmailed === '0' ? styles['selected'] : ''}`}
                      >
                        0
                      </button>
                      <button
                        onClick={() => handleAnswer('companiesEmailed', '1-5')}
                        className={`${styles['flow-option-button']} ${answers.companiesEmailed === '1-5' ? styles['selected'] : ''}`}
                      >
                        1-5
                      </button>
                      <button
                        onClick={() => handleAnswer('companiesEmailed', '6-20')}
                        className={`${styles['flow-option-button']} ${answers.companiesEmailed === '6-20' ? styles['selected'] : ''}`}
                      >
                        6-20
                      </button>
                      <button
                        onClick={() => handleAnswer('companiesEmailed', '20+')}
                        className={`${styles['flow-option-button']} ${answers.companiesEmailed === '20+' ? styles['selected'] : ''}`}
                      >
                        20+
                      </button>
                    </div>
                  </div>

                  {/* Question 4 */}
                  <div className={styles['flow-question']}>
                    <h3 className={styles['flow-question-title']}>
                      How many different companies did you <span className={styles['underlined']}>interview</span> with?*
                    </h3>
                    <div className={styles['flow-options']}>
                      <button
                        onClick={() => handleAnswer('companiesInterviewed', '0')}
                        className={`${styles['flow-option-button']} ${answers.companiesInterviewed === '0' ? styles['selected'] : ''}`}
                      >
                        0
                      </button>
                      <button
                        onClick={() => handleAnswer('companiesInterviewed', '1-2')}
                        className={`${styles['flow-option-button']} ${answers.companiesInterviewed === '1-2' ? styles['selected'] : ''}`}
                      >
                        1-2
                      </button>
                      <button
                        onClick={() => handleAnswer('companiesInterviewed', '3-5')}
                        className={`${styles['flow-option-button']} ${answers.companiesInterviewed === '3-5' ? styles['selected'] : ''}`}
                      >
                        3-5
                      </button>
                      <button
                        onClick={() => handleAnswer('companiesInterviewed', '5+')}
                        className={`${styles['flow-option-button']} ${answers.companiesInterviewed === '5+' ? styles['selected'] : ''}`}
                      >
                        5+
                      </button>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className={styles['flow-actions']}>
                    <button
                      onClick={handleStep1Continue}
                      disabled={isContinueDisabled()}
                      className={`${styles['flow-continue-button']} ${isContinueDisabled() ? styles['disabled'] : ''}`}
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
      )}

      {currentStep === 2 && (
        <Step2
          onBack={handleBack}
          onContinue={handleStep2Continue}
          onClose={handleClose}
        />
      )}

      {currentStep === 3 && (
        <Step3
          onBack={handleBack}
          onComplete={handleStep3Complete}
          onClose={handleClose}
        />
      )}

          {currentStep === '3-alt' && (
            <Step3Alt
              onBack={handleBack}
              onComplete={handleStep3AltComplete}
              onClose={handleClose}
            />
          )}
        </>
      )}
    </>
  );
}
