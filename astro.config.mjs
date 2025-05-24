import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
// import clerk from '@clerk/astro';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    port: parseInt(process.env.PORT || '3000'),
    host: true // This is key - setting host: true ensures binding to 0.0.0.0
  }),
  integrations: [
    // clerk(),
    tailwind({ applyBaseStyles: false }),
    react(),
  ]
});