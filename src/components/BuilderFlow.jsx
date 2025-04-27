// src/components/BuilderFlow.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { siteType, siteSubType, setSiteType, setSiteSubType } from '../store/siteStore';
import SiteTypeSelector from './SiteTypeSelector';
import SubTypeSelector from './SubTypeSelector';
import VibeCustomizer from './VibeCustomizer';
import SitePreview from './SitePreview';

export default function BuilderFlow() {
  const $siteType = useStore(siteType);
  const $siteSubType = useStore(siteSubType);
  const [step, setStep] = useState('type'); // 'type', 'subtype', 'customize'
  
  // Update step based on selections
  useEffect(() => {
    if (!$siteType) {
      setStep('type');
    } else if (!$siteSubType) {
      setStep('subtype');
    } else {
      setStep('customize');
    }
  }, [$siteType, $siteSubType]);
  
  // Handle back button
  const handleBack = () => {
    if (step === 'subtype') {
      setSiteType(null);
    } else if (step === 'customize') {
      setSiteSubType(null);
    }
  };
  
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };
  
  return (
    <div className="builder-flow">
      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <ul className="steps steps-horizontal">
          <li className={`step ${step === 'type' || step === 'subtype' || step === 'customize' ? 'step-primary' : ''}`}>
            Choose Type
          </li>
          <li className={`step ${step === 'subtype' || step === 'customize' ? 'step-primary' : ''}`}>
            Refine Type
          </li>
          <li className={`step ${step === 'customize' ? 'step-primary' : ''}`}>
            Customize
          </li>
        </ul>
      </div>
      
      {/* Back button (show only if not on first step) */}
      {step !== 'type' && (
        <button 
          className="btn btn-ghost mb-4"
          onClick={handleBack}
        >
          ← Back
        </button>
      )}
      
      {/* Content area with animations */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          custom={step === 'type' ? -1 : 1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.3 }}
        >
          {step === 'type' && <SiteTypeSelector />}
          {step === 'subtype' && <SubTypeSelector />}
          {step === 'customize' && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Customization Controls (Left Side) */}
              <div className="w-full lg:w-1/3">
                <h1 className="text-3xl font-bold mb-6">Customize Your Vibe</h1>
                <p className="mb-8">Adjust these sliders to create the perfect feel for your site.</p>
                
                <VibeCustomizer />
              </div>
              
              {/* Live Preview (Right Side) */}
              <div className="w-full lg:w-2/3 bg-base-200 p-4 rounded-xl">
                <div className="sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                  <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
                    <SitePreview />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}