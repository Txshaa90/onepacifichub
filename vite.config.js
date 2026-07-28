import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: '/',
  // Expose Vercel-provided env vars to the Vite client build.
  // Your Vercel envs are currently named SHOPIFY_* (no VITE_ prefix).
  envPrefix: ['VITE_', 'SHOPIFY_'],
  resolve: {
    alias: {
      'framer-motion': fileURLToPath(new URL('./src/lib/staticMotion.jsx', import.meta.url))
    }
  },
})
