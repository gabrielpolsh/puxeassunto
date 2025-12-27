import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0'
        // Removed /images proxy - now using signed URLs directly from Supabase
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Use esbuild for minification (built-in, faster than terser)
        minify: 'esbuild',
        // Optimize chunk splitting for better caching and parallel loading
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks for better caching
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-supabase': ['@supabase/supabase-js'],
              'vendor-icons': ['lucide-react'],
            },
          },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 500,
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Generate source maps for production debugging (optional)
        sourcemap: false,
        // Target modern browsers for smaller bundles
        target: 'es2020',
      },
      // Optimize dependency pre-bundling
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
      },
    };
});
