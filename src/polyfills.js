import { Buffer as NodeBuffer } from 'buffer';

// Ensure global objects are available
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = window.process || { env: {} };
  window.globalThis = window.globalThis || window;
}

// Initialize Buffer globally
const initBuffer = () => {
  const target = typeof globalThis !== 'undefined' ? globalThis : 
                typeof window !== 'undefined' ? window : 
                typeof self !== 'undefined' ? self : 
                this;

  // Only set Buffer if it's not already defined
  if (!target.Buffer) {
    target.Buffer = NodeBuffer;
    target.Buffer.from = NodeBuffer.from.bind(NodeBuffer);
    target.Buffer.alloc = NodeBuffer.alloc.bind(NodeBuffer);
    target.Buffer.allocUnsafe = NodeBuffer.allocUnsafe.bind(NodeBuffer);
    target.Buffer.isBuffer = NodeBuffer.isBuffer.bind(NodeBuffer);
  }

  // Ensure Buffer is available on window if in browser environment
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = target.Buffer;
  }

  return target.Buffer;
};

// Initialize crypto globally
const initCrypto = () => {
  if (typeof window !== 'undefined') {
    window.crypto = window.crypto || {};
    window.crypto.subtle = window.crypto.subtle || {};
  }
};

// Initialize Buffer and export it
const Buffer = initBuffer();
initCrypto();

export { Buffer };