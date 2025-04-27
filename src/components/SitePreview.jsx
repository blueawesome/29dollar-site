// src/components/VibeCustomizer.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { selectedVibe, customizationOptions, updateCustomization } from '../store/siteStore';

// Mock sound function (create proper sound utility later)
const playSound = (type) => {
  console.log(`Playing sound: ${type}`);
  // We'll implement this properly later
};

export default function VibeCustomizer() {
  const $selectedVibe = useStore(selectedVibe);
  const $options = useStore(customizationOptions);
  
  // Handle slider changes
  const handleSliderChange = (name, value) => {
    playSound('slide');
    updateCustomization({ [name]: value });
  };
  
  // Handle vibe presets
  const selectVibePreset = (vibe) => {
    playSound('select');
    selectedVibe.set(vibe);
    
    // Set slider defaults based on vibe
    switch(vibe) {
      case 'playful':
        updateCustomization({
          playfulness: 90,
          boldness: 70,
          minimalism: 20,
          nostalgia: 30
        });
        break;
      case 'minimal':
        updateCustomization({
          playfulness: 10,
          boldness: 30,
          minimalism: 90,
          nostalgia: 0
        });
        break;
      case 'retro':
        updateCustomization({
          playfulness: 60,
          boldness: 50,
          minimalism: 10,
          nostalgia: 90
        });
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="vibe-customizer">
      {/* Vibe presets */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Choose a starting point:</h3>
        <div className="flex flex-wrap gap-2">
          {['playful', 'minimal', 'retro'].map(vibe => (
            <motion.button
              key={vibe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn ${$selectedVibe === vibe ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => selectVibePreset(vibe)}
            >
              {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Customization sliders */}
      <div className="space-y-8">
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-lg">Playfulness</span>
              <span className="label-text-alt">{$options.playfulness || 50}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={$options.playfulness || 50} 
              className="range range-primary" 
              step="5"
              onChange={(e) => handleSliderChange('playfulness', parseInt(e.target.value))}
            />
            <div className="label">
              <span className="label-text-alt">Serious</span>
              <span className="label-text-alt">Playful</span>
            </div>
          </label>
        </div>
        
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-lg">Boldness</span>
              <span className="label-text-alt">{$options.boldness || 50}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={$options.boldness || 50} 
              className="range range-secondary" 
              step="5"
              onChange={(e) => handleSliderChange('boldness', parseInt(e.target.value))}
            />
            <div className="label">
              <span className="label-text-alt">Subtle</span>
              <span className="label-text-alt">Bold</span>
            </div>
          </label>
        </div>
        
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-lg">Minimalism</span>
              <span className="label-text-alt">{$options.minimalism || 50}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={$options.minimalism || 50} 
              className="range range-accent" 
              step="5"
              onChange={(e) => handleSliderChange('minimalism', parseInt(e.target.value))}
            />
            <div className="label">
              <span className="label-text-alt">Detailed</span>
              <span className="label-text-alt">Minimal</span>
            </div>
          </label>
        </div>
        
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-lg">Nostalgia</span>
              <span className="label-text-alt">{$options.nostalgia || 0}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={$options.nostalgia || 0} 
              className="range" 
              step="5"
              onChange={(e) => handleSliderChange('nostalgia', parseInt(e.target.value))}
            />
            <div className="label">
              <span className="label-text-alt">Modern</span>
              <span className="label-text-alt">Retro</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}