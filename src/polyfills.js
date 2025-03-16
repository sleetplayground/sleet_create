// Ensure global objects are available
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = window.process || { env: {} };
  window.globalThis = window.globalThis || window;
}

// Import Buffer from the buffer package
import { Buffer } from 'buffer';

// Initialize Buffer globally if not already available
const initBuffer = () => {
  const target = typeof globalThis !== 'undefined' ? globalThis : 
                typeof window !== 'undefined' ? window : 
                typeof self !== 'undefined' ? self : 
                this;

  if (!target.Buffer) {
    target.Buffer = Buffer;
    // Ensure Buffer is available on window if in browser environment
    if (typeof window !== 'undefined') {
      window.Buffer = target.Buffer;
    }
  }
};

// Initialize crypto globally
const initCrypto = () => {
  if (typeof window !== 'undefined') {
    window.crypto = window.crypto || {};
    window.crypto.subtle = window.crypto.subtle || {};
  }
};

// Initialize Buffer and crypto
initBuffer();
initCrypto();