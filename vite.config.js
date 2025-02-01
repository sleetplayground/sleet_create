import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: {
      '@': '/src',
      buffer: 'buffer',
    },
  },
  define: {
    'global': 'globalThis',
    'process.env': {},
    'process.env.NODE_DEBUG': 'false',
    'Buffer': ['buffer', 'Buffer'],
    'Buffer.isBuffer': ['buffer', 'Buffer', 'isBuffer'],
    'Buffer.from': ['buffer', 'Buffer', 'from'],
    'Buffer.alloc': ['buffer', 'Buffer', 'alloc']
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true
        })
      ]
    },
    force: true,
    include: [
      'buffer',
      '@near-wallet-selector/core',
      '@near-wallet-selector/modal-ui',
      '@near-wallet-selector/my-near-wallet',
      '@near-wallet-selector/sender',
      '@near-wallet-selector/here-wallet',
      '@near-wallet-selector/meteor-wallet',
      '@near-wallet-selector/near-mobile-wallet',
      '@near-wallet-selector/welldone-wallet',
      '@near-wallet-selector/bitte-wallet',
      '@near-wallet-selector/ledger',
      '@near-wallet-selector/ethereum-wallets'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'near-api': ['near-api-js', '@near-js/providers', '@near-js/utils'],
          'wallet-selector': [
            '@near-wallet-selector/core',
            '@near-wallet-selector/modal-ui',
            '@near-wallet-selector/my-near-wallet',
            '@near-wallet-selector/sender',
            '@near-wallet-selector/here-wallet',
            '@near-wallet-selector/meteor-wallet',
            '@near-wallet-selector/near-mobile-wallet',
            '@near-wallet-selector/welldone-wallet',
            '@near-wallet-selector/bitte-wallet',
            '@near-wallet-selector/ledger',
            '@near-wallet-selector/ethereum-wallets'
          ]
        }
      }
    }
  }
})