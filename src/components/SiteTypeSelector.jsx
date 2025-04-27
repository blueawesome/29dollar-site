// src/components/SiteTypeSelector.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { setSiteType } from '../store/siteStore';

const siteTypes = [
  {
    id: 'personal',
    title: 'Personal Website',
    description: 'Share your story, interests, or professional background',
    icon: '👤'
  },
  {
    id: 'event',
    title: 'Event',
    description: 'Wedding, birthday, reunion with RSVPs and countdowns',
    icon: '🎉'
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Local service, small shop, or consultant presence',
    icon: '💼'
  },
  {
    id: 'artist',
    title: 'Artist/Band',
    description: 'Showcase creative work, music, or performances',
    icon: '🎨'
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Visual showcase of your work and projects',
    icon: '📂'
  },
  {
    id: 'landing',
    title: 'Landing Page',
    description: 'Focused micro-site for a product or campaign',
    icon: '🚀'
  }
];

export default function SiteTypeSelector() {
  const [selected, setSelected] = useState(null);
  
  const handleSelect = (typeId) => {
    setSelected(typeId);
    setSiteType(typeId);
    // playSound('select');
    
    // No navigation needed - the parent component will handle switching to the next step
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {siteTypes.map((type) => (
        <motion.div
          key={type.id}
          className={`card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-all ${
            selected === type.id ? 'ring-4 ring-primary' : ''
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect(type.id)}
        >
          <div className="card-body text-center">
            <div className="text-4xl mb-4">{type.icon}</div>
            <h2 className="card-title justify-center">{type.title}</h2>
            <p>{type.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}