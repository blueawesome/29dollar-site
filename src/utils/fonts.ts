// src/utils/fonts.ts

export function generateFontLinks(vibe: string) {
  const fontsToLoad = {
    playful: [
      'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap'
    ],
    minimal: [
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400&display=swap',
      'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500&display=swap'
    ],
    bold: [
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap'
    ],
    retro: [
      'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Quattrocento:wght@400;700&display=swap'
    ],
    corporate: [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600&display=swap'
    ],
    artistic: [
      'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap',
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap'
    ]
  };
  
  return fontsToLoad[vibe] || fontsToLoad['minimal']; // Default to minimal if vibe not found
}