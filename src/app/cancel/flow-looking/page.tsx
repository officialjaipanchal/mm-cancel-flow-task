'use client';

import { useState } from 'react';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Completion from './completion';
import OfferAccepted from './offer-accepted';
import OfferAccepted2 from './offer-accepted2';

type FlowStep = 'step1' | 'step2' | 'step3' | 'completion' | 'offer-accepted' | 'offer-accepted2';

export default function FlowLookingPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('step1');
  const [abTestingData, setAbTestingData] = useState<any>(null);
  // const [offerType, setOfferType] = useState<'job-recommendations' | 'subscription'>('job-recommendations');

  // Helper function to get random choice with better distribution
  const getRandomChoice = (): 'job-recommendations' | 'subscription' => {
    const random = Math.random();
    return random < 0.5 ? 'job-recommendations' : 'subscription';
  };

  // Detect mobile viewport
  const isMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  };

  const handleAcceptOffer = (abData?: any) => {
    // Store A/B testing data if provided
    if (abData) {
      setAbTestingData(abData);
    }
    
    // On mobile, always show OfferAccepted (subscription confirmation style)
    if (isMobile()) {
      setCurrentStep('offer-accepted');
      return;
    }

    // Otherwise randomly choose between job recommendations and subscription details
    const randomChoice = getRandomChoice();
    const nextStep = randomChoice === 'job-recommendations' ? 'offer-accepted' : 'offer-accepted2';
    setCurrentStep(nextStep);
  };

  const handleNext = () => {
    if (currentStep === 'step1') {
      setCurrentStep('step2');
    } else if (currentStep === 'step2') {
      setCurrentStep('step3');
    }
  };

  const handleBack = () => {
    if (currentStep === 'step2') {
      setCurrentStep('step1');
    } else if (currentStep === 'step3') {
      setCurrentStep('step2');
    } else {
      window.history.back();
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  const handleFinish = () => {
    setCurrentStep('completion');
  };

  const handleBackToJobs = () => {
    window.history.back();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'step1':
        return (
          <Step1
            onNext={handleNext}
            onBack={handleBack}
            onClose={handleClose}
            onAcceptOffer={handleAcceptOffer}
          />
        );
      case 'step2':
        return (
          <Step2
            onNext={handleNext}
            onBack={handleBack}
            onClose={handleClose}
            onAcceptOffer={handleAcceptOffer}
          />
        );
      case 'step3':
        return (
          <Step3
            onComplete={handleFinish}
            onBack={handleBack}
            onClose={handleClose}
            onAcceptOffer={handleAcceptOffer}
          />
        );
      case 'completion':
        return (
          <Completion
            onBackToJobs={handleBackToJobs}
            onClose={handleClose}
          />
        );
      case 'offer-accepted':
        return (
          <OfferAccepted
            onClose={handleClose}
            abTestingData={abTestingData}
          />
        );
      case 'offer-accepted2':
        return (
          <OfferAccepted2
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return renderCurrentStep();
}
