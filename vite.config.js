import { defineConfig } from 'vite';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [nodePolyfills()],
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        account: resolve(__dirname, 'pages/account.html'),
        sub: resolve(__dirname, 'pages/sub.html')
      }
    }
  },
  server: {
    port: 3000
  }
});