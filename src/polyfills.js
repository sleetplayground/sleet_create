import { Buffer } from 'buffer';

// Ensure Buffer is available globally
globalThis.Buffer = Buffer;
window.Buffer = Buffer;