import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    port: process.env.PORT || 4321,    // <--- ADD THIS
    host: '0.0.0.0'                    // <--- ADD THIS
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    clerk(),
  ],
});
