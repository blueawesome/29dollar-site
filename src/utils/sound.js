// src/utils/sound.js
let soundEnabled = true;

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

export const playSound = (type) => {
  if (!soundEnabled) return;
  
  const sounds = {
    hover: '/sounds/hover.mp3',
    select: '/sounds/select.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3'
  };
  
  if (sounds[type]) {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Audio play error:', err));
  }
};