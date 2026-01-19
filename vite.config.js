import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'three-vendor': ['three'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild', // Faster than terser
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three'],
    exclude: [],
  },
  esbuild: {
    // Faster builds
    legalComments: 'none',
    treeShaking: true,
  },
  server: {
    // Faster HMR
    hmr: true,
  },
  base: '/',
})



