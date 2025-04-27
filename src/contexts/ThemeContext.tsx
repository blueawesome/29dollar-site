// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { vibes, VibeType } from '../themes/vibes';
import { colorSchemes, ColorSchemeType } from '../themes/colors';

interface ThemeContextValue {
  vibe: VibeType;
  colorScheme: ColorSchemeType;
  setVibe: (vibe: VibeType) => void;
  setColorScheme: (scheme: ColorSchemeType) => void;
  theme: any;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [vibe, setVibe] = useState<VibeType>('minimal');
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>('sunset');
  
  // Create combined theme
  const theme = {
    ...vibes[vibe],
    colors: colorSchemes[colorScheme]
  };
  
  return (
    <ThemeContext.Provider value={{ vibe, colorScheme, setVibe, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}