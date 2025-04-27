// src/components/VibePlayground.tsx
import React, { useState } from 'react';
import HeroOverlayImage from '../templates/hero/HeroOverlayImage';
import type { VibeType } from '../themes/vibes';

export default function VibePlayground() {
  const [currentVibe, setCurrentVibe] = useState<VibeType>('minimal');

  // Content variations for each vibe
  const vibeContent = {
    minimal: {
      title: "Minimal Design",
      subtitle: "Clean, elegant design focused on content",
      buttonText: "Explore",
      image: "https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp"
    },
    playful: {
      title: "Fun & Playful",
      subtitle: "Vibrant and engaging design with personality",
      buttonText: "Let's Go!",
      image: "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
    },
    bold: {
      title: "BOLD IMPACT",
      subtitle: "Strong and attention-grabbing designs",
      buttonText: "DISCOVER",
      image: "https://img.daisyui.com/images/stock/photo-1503023345310-bd7c1de61c7d.webp" // <-- NEW
    },
    retro: {
      title: "Nostalgic Appeal",
      subtitle: "Classic, vintage, and reminiscent of the past",
      buttonText: "Time Machine",
      image: "https://img.daisyui.com/images/stock/photo-1604583213971-6d16e4b88a78.webp" // <-- NEW
    },
    corporate: {
      title: "Professional Excellence",
      subtitle: "Trustworthy, refined, and business-oriented",
      buttonText: "Learn More",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
    },
    artistic: {
      title: "Creative Expression",
      subtitle: "Unique, experimental, and visually striking",
      buttonText: "Explore Art",
      image: "https://img.daisyui.com/images/stock/photo-1541339907198-e08756dedf3f.webp" // <-- NEW
    }
  };
  

  const content = vibeContent[currentVibe];

  return (
    <div className="p-4 mb-8">
      <h1 className="text-3xl font-bold mb-4">Component Playground</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Hero with Overlay Image</h2>
        <p className="mb-4">Current vibe: <span className="font-bold">{currentVibe}</span></p>
        
        {/* Vibe Selector */}
        <div className="tabs tabs-boxed mb-6 inline-flex">
          <button 
            className={`tab ${currentVibe === 'minimal' ? 'tab-active' : ''}`} 
            onClick={() => setCurrentVibe('minimal')}
          >
            Minimal
          </button>
          <button 
            className={`tab ${currentVibe === 'playful' ? 'tab-active' : ''}`} 
            onClick={() => setCurrentVibe('playful')}
          >
            Playful
          </button>
          <button 
            className={`tab ${currentVibe === 'bold' ? 'tab-active' : ''}`} 
            onClick={() => setCurrentVibe('bold')}
          >
            Bold
          </button>
          <button 
            className={`tab ${currentVibe === 'retro' ? 'tab-active' : ''}`} 
            onClick={() => setCurrentVibe('retro')}
          >
            Retro
          </button>
          <button 
            className={`tab ${currentVibe === 'corporate' ? 'tab-active' : ''}`} 
            onClick={() => setCurrentVibe('corporate')}
          >
            Corporate
          </button>
          <button 
            className={`tab ${currentVibe === 'artistic' ? 'tab-active' : ''}`} 
            onClick={() => setCurrentVibe('artistic')}
          >
            Artistic
          </button>
        </div>
      </div>
      
      {/* Component Display */}
      <div className="border border-base-300 rounded-xl overflow-hidden shadow-xl">
      <HeroOverlayImage
  backgroundImage={content.image}
  title={content.title}
  subtitle={content.subtitle}
  buttonText={content.buttonText}
  buttonLink="#"
  vibeStyle={currentVibe}
/>

      </div>
    </div>
  );
}