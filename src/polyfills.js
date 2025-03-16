import { Buffer } from 'buffer';

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

  target.Buffer = Buffer;
  target.Buffer.from = Buffer.from.bind(Buffer);
  target.Buffer.alloc = Buffer.alloc.bind(Buffer);
  target.Buffer.allocUnsafe = Buffer.allocUnsafe.bind(Buffer);
  target.Buffer.isBuffer = Buffer.isBuffer.bind(Buffer);

  // Ensure Buffer is available on window if in browser environment
  if (typeof window !== 'undefined') {
    window.Buffer = target.Buffer;
  }
};

initBuffer();

// Re-export Buffer for modules that import it directly
export { Buffer };