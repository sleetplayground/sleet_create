import { Buffer } from 'buffer';

// Ensure global objects are available
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = window.process || { env: {} };
  window.globalThis = window.globalThis || window;
}

// Initialize Buffer globally first
const initBuffer = () => {
  const target = typeof globalThis !== 'undefined' ? globalThis : 
                typeof window !== 'undefined' ? window : 
                typeof self !== 'undefined' ? self : 
                this;

  // Create a new Buffer constructor with all methods bound
  const BufferClass = function(...args) {
    return Buffer.apply(this, args);
  };
  Object.setPrototypeOf(BufferClass, Buffer);
  BufferClass.prototype = Buffer.prototype;

  // Explicitly bind all Buffer methods
  BufferClass.from = Buffer.from.bind(Buffer);
  BufferClass.alloc = Buffer.alloc.bind(Buffer);
  BufferClass.allocUnsafe = Buffer.allocUnsafe.bind(Buffer);
  BufferClass.isBuffer = Buffer.isBuffer.bind(Buffer);
  BufferClass.concat = Buffer.concat.bind(Buffer);
  BufferClass.byteLength = Buffer.byteLength.bind(Buffer);

  // Assign to target
  target.Buffer = BufferClass;

  // Ensure Buffer is available on window if in browser environment
  if (typeof window !== 'undefined') {
    window.Buffer = target.Buffer;
  }

  // Ensure Buffer is available on globalThis
  if (typeof globalThis !== 'undefined') {
    globalThis.Buffer = target.Buffer;
  }
};

// Execute Buffer initialization immediately
initBuffer();

// Re-export Buffer for modules that import it directly
export { Buffer };