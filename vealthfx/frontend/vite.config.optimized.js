// Performance optimization configuration
// Add to vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Performance optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'wallet': ['@aptos-labs/wallet-adapter-react', '@aptos-labs/wallet-adapter-ant-design'],
          'charts': ['recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  // Development performance
  server: {
    hmr: {
      overlay: false // Reduce dev overlay impact
    }
  },
  
  // Asset optimization
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg'],
  
  // CSS optimization
  css: {
    postcss: './postcss.config.js'
  }
})
