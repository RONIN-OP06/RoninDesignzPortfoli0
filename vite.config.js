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
    target: 'esnext', // Use modern JS for smaller bundles
    sourcemap: false, // Disable sourcemaps in production for faster builds
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three'],
    exclude: [],
    // Pre-bundle dependencies for faster dev server startup
    force: false, // Only re-optimize when needed
  },
  esbuild: {
    // Faster builds
    legalComments: 'none',
    treeShaking: true,
    target: 'esnext', // Use modern JS
  },
  server: {
    // Faster HMR with reduced overhead
    hmr: {
      overlay: false, // Disable error overlay to reduce load
    },
    // Reduce file watching overhead
    watch: {
      usePolling: false, // Use native file system events
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
    },
    // Optimize middleware
    middlewareMode: false,
  },
  // Reduce preview server overhead
  preview: {
    port: 4173,
    strictPort: true,
  },
  base: '/',
})



