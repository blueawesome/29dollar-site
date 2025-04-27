// src/components/SubTypeSelector.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { siteType, setSiteSubType } from '../store/siteStore';
import { playSound } from '../utils/sound';

// Define subtypes for each main type
const siteSubTypes = {
  personal: [
    { id: 'portfolio', title: 'Portfolio', description: 'Showcase your best work and projects', icon: '📂' },
    { id: 'resume', title: 'Resume/CV', description: 'Professional background and experience', icon: '📄' },
    { id: 'personal-home', title: 'Personal Home Page', description: 'Your central place on the web', icon: '🏠' },
    { id: 'geocities', title: 'Geocities Style', description: 'Nostalgic 90s web aesthetic', icon: '💾' }
  ],
  event: [
    { id: 'wedding', title: 'Wedding', description: 'Share your special day with guests', icon: '💍' },
    { id: 'party', title: 'Birthday / Party', description: 'Celebration details and RSVP', icon: '🎂' },
    { id: 'reunion', title: 'Reunion', description: 'Bring people back together', icon: '👪' },
    { id: 'conference', title: 'Conference', description: 'Event schedule and information', icon: '🎤' }
  ],
  business: [
    { id: 'local', title: 'Local Business', description: 'Storefront and service information', icon: '🏪' },
    { id: 'freelancer', title: 'Freelancer / Consultant', description: 'Services and expertise', icon: '💼' },
    { id: 'restaurant', title: 'Restaurant', description: 'Menu, hours, and reservations', icon: '🍽️' }
  ],
  artist: [
    { id: 'musician', title: 'Musician', description: 'Music, tours, and fan engagement', icon: '🎸' },
    { id: 'visual', title: 'Visual Artist', description: 'Gallery and artistic portfolio', icon: '🎨' },
    { id: 'author', title: 'Author', description: 'Books, writing, and publications', icon: '📚' },
    { id: 'performer', title: 'Performer', description: 'Shows, acts, and performance info', icon: '🎭' }
  ],
  portfolio: [
    { id: 'photography', title: 'Photography', description: 'Visual showcase of your photos', icon: '📷' },
    { id: 'design', title: 'Design', description: 'Design work and creative projects', icon: '✏️' },
    { id: 'art', title: 'Art', description: 'Artwork and creative pieces', icon: '🖼️' },
    { id: 'writing', title: 'Writing', description: 'Articles, stories, and written work', icon: '✍️' }
  ],
  landing: [
    { id: 'product', title: 'Product Launch', description: 'Introduce your new product', icon: '🚀' },
    { id: 'app', title: 'App Download', description: 'Promote your application', icon: '📱' },
    { id: 'book', title: 'Book Promotion', description: 'Market your book or publication', icon: '📕' }
  ]
};

export default function SubTypeSelector() {
  const $siteType = useStore(siteType);
  const [selected, setSelected] = useState(null);
  const [subTypes, setSubTypes] = useState([]);
  
  // Update subtypes when main type changes
  useEffect(() => {
    if ($siteType && siteSubTypes[$siteType]) {
      setSubTypes(siteSubTypes[$siteType]);
    }
  }, [$siteType]);
  
  const handleSelect = (subTypeId) => {
    setSelected(subTypeId);
    setSiteSubType(subTypeId);
    // playSound('select');
    
    // No navigation needed - the parent component will handle switching to the next step
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose a specific type</h1>
        <p className="text-lg">Select the option that best matches your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subTypes.map((subType) => (
          <motion.div
            key={subType.id}
            className={`card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-all ${
              selected === subType.id ? 'ring-4 ring-primary' : ''
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(subType.id)}
          >
            <div className="card-body text-center">
              <div className="text-4xl mb-4">{subType.icon}</div>
              <h2 className="card-title justify-center">{subType.title}</h2>
              <p>{subType.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}