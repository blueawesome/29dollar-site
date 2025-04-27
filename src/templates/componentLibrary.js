// src/templates/componentLibrary.js
// This will define all the available components for generated sites

export const components = {
  // Headers
  headers: {
    simple: {
      name: 'Simple Header',
      component: 'SimpleHeader',
      props: ['title', 'subtitle', 'logo']
    },
    hero: {
      name: 'Hero Header',
      component: 'HeroHeader',
      props: ['title', 'subtitle', 'backgroundImage', 'buttonText', 'buttonUrl']
    },
    // Add more header variations
  },
  
  // Content Sections
  sections: {
    textBlock: {
      name: 'Text Block',
      component: 'TextBlock',
      props: ['title', 'content', 'alignment']
    },
    features: {
      name: 'Feature List',
      component: 'FeatureList',
      props: ['title', 'features']
    },
    gallery: {
      name: 'Image Gallery',
      component: 'Gallery',
      props: ['title', 'images']
    },
    // Add more section variations
  },
  
  // Footers
  footers: {
    simple: {
      name: 'Simple Footer',
      component: 'SimpleFooter',
      props: ['copyright', 'links']
    },
    contact: {
      name: 'Contact Footer',
      component: 'ContactFooter',
      props: ['email', 'phone', 'address', 'socialLinks']
    },
    // Add more footer variations
  }
};

// Define preset templates for each site type
export const siteTemplates = {
  personal: {
    header: 'hero',
    sections: ['textBlock', 'gallery'],
    footer: 'contact'
  },
  event: {
    header: 'hero',
    sections: ['textBlock', 'gallery'],
    footer: 'simple'
  },
  // Add templates for other site types
};