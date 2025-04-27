// src/styles/vibes.js
export const vibes = {
    playful: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        neutral: '#2A363B',
        base100: '#FFFFFF',
        base200: '#F9F9F9',
        base300: '#EEEEEE'
      },
      typography: {
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
        fontSize: '1.05rem',
        headingStyle: 'bold',
        rounded: '1rem'
      },
      spacing: {
        loose: true,
        padding: '1.5rem'
      }
    },
    
    minimal: {
      colors: {
        primary: '#0066FF',
        secondary: '#888888',
        accent: '#FF9900',
        neutral: '#333333',
        base100: '#FFFFFF',
        base200: '#F7F7F7',
        base300: '#EEEEEE'
      },
      typography: {
        fontFamily: "'Inter', 'Helvetica', sans-serif",
        fontSize: '1rem',
        headingStyle: 'light',
        rounded: '0.25rem'
      },
      spacing: {
        loose: false,
        padding: '1rem'
      }
    },
    
    retro: {
      colors: {
        primary: '#E84855',
        secondary: '#43B5A0',
        accent: '#F9DC5C',
        neutral: '#574B60',
        base100: '#FFFFFC',
        base200: '#FEEAA1',
        base300: '#FAC9B8'
      },
      typography: {
        fontFamily: "'VT323', 'Courier New', monospace",
        fontSize: '1.1rem',
        headingStyle: 'normal',
        rounded: '0'
      },
      spacing: {
        loose: true,
        padding: '1.25rem'
      }
    }
  };
  
  // Helper to apply a vibe to DaisyUI theme
  export const applyVibe = (vibeName, intensity = 1) => {
    const vibe = vibes[vibeName];
    if (!vibe) return {};
    
    // This would return CSS variables that could be applied
    // to your document root to change the theme
    return {
      '--primary': vibe.colors.primary,
      '--secondary': vibe.colors.secondary,
      '--accent': vibe.colors.accent,
      // etc.
    };
  };