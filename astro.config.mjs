import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node'; // <-- replacing cloudflare adapter with node
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',  // <-- REQUIRED for Clerk
  adapter: node({
    mode: 'standalone', // Same idea as cloudflare advanced
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    clerk(), // <-- Added Clerk integration
  ],
});
