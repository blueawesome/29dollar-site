import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import clerk from '@clerk/astro';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server',
  adapter: node({ 
    mode: 'standalone', 
    port: process.env.PORT || 4321, 
    host: '0.0.0.0' 
  }),
  integrations: [
    clerk(),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
