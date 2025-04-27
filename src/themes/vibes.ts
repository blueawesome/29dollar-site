// src/themes/vibes.ts

export type VibeType = 'playful' | 'minimal' | 'bold' | 'retro' | 'corporate' | 'artistic';

export const vibeStyles = {
  // Playful & Quirky
  playful: {
    container: 'rounded-3xl overflow-hidden',
    overlay: 'hero-overlay bg-gradient-to-r from-purple-500/70 to-pink-500/70',
    content: 'hero-content text-center text-neutral-content',
    heading: 'mb-5 text-5xl font-bold text-yellow-300 tracking-normal rotate-1',
    subtitle: 'mb-5 text-lg font-medium text-yellow-100',
    button: 'btn btn-primary rounded-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:scale-105 transition-transform'
  },
  
  // Minimal & Elegant
  minimal: {
    container: '',
    overlay: 'hero-overlay bg-black/40',
    content: 'hero-content text-center text-neutral-content',
    heading: 'mb-8 text-5xl font-extralight tracking-widest uppercase text-white',
    subtitle: 'mb-8 font-light tracking-wider text-white/90',
    button: 'btn btn-outline border-white text-white hover:bg-white hover:text-black transition-all duration-300'
  },
  
  // Bold & Expressive
  bold: {
    container: '',
    overlay: 'hero-overlay bg-black/75',
    content: 'hero-content text-center text-neutral-content max-w-5xl',
    heading: 'mb-6 text-7xl font-black uppercase tracking-wider text-red-500 drop-shadow-lg',
    subtitle: 'mb-6 font-medium uppercase tracking-wider text-white text-lg',
    button: 'btn btn-lg btn-primary uppercase font-bold text-lg bg-red-600 border-none hover:bg-red-700'
  },
  
  // Retro & Nostalgic
  retro: {
    container: '',
    overlay: 'hero-overlay bg-black/50 bg-[radial-gradient(circle,_transparent_20%,_black_150%)] bg-[length:4px_4px]',
    content: 'hero-content text-center text-neutral-content',
    heading: 'mb-5 text-5xl font-mono font-bold text-amber-300 border-b-4 border-amber-300 pb-2 inline-block',
    subtitle: 'mb-5 font-mono text-amber-100',
    button: 'btn btn-secondary font-mono border-2 border-amber-300 bg-transparent text-amber-300 hover:bg-amber-300 hover:text-black'
  },
  
  // Corporate & Professional
  corporate: {
    container: '',
    overlay: 'hero-overlay bg-gradient-to-b from-slate-900/80 to-slate-800/90',
    content: 'hero-content text-center text-neutral-content',
    heading: 'mb-5 text-5xl font-serif font-semibold text-white',
    subtitle: 'mb-5 font-serif text-slate-200',
    button: 'btn btn-primary font-serif bg-blue-600 border-none hover:bg-blue-700'
  },
  
  // Artistic & Experimental
  artistic: {
    container: '',
    overlay: 'hero-overlay bg-black/30 backdrop-blur-sm',
    content: 'hero-content text-center text-neutral-content rotate-[-1deg]',
    heading: 'mb-5 text-6xl italic font-medium text-white drop-shadow-lg',
    subtitle: 'mb-5 italic text-lg text-white/90',
    button: 'btn btn-accent italic bg-teal-500 border-none hover:bg-teal-600 shadow-lg'
  }
};