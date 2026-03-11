/**
 * Polyfills para compatibilidade com navegadores mobile
 */

// Zone.js é necessário para Angular
import 'zone.js';

// Polyfills para navegadores mais antigos
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}
