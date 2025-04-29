import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import clerk from '@clerk/astro';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    // Render will set PORT env variable automatically
    port: parseInt(process.env.PORT || '4321'),
    // This ensures your app binds to the correct interface
    host: process.env.HOST || '0.0.0.0'
  }),
  site: process.env.SITE_URL || 'https://your-29dollar-site.onrender.com',
  integrations: [
    clerk(),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
  vite: {
    // Add Vite configurations if needed
    ssr: {
      // External packages that shouldn't be bundled
      noExternal: []
    }
  }
});