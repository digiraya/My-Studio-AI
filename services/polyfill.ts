/**
 * Polyfill to ensure window.fetch has both getter and setter on Window and Window.prototype.
 * Resolves "TypeError: Cannot set property fetch of #<Window> which has only a getter"
 * encountered when browser extensions or test harnesses attempt to wrap window.fetch.
 */
export function setupFetchPolyfill() {
  if (typeof window === 'undefined') return;

  try {
    const originalFetch = window.fetch ? window.fetch.bind(window) : null;
    let activeFetch = originalFetch;

    try {
      Object.defineProperty(window, 'fetch', {
        get() {
          return activeFetch;
        },
        set(newFetch) {
          activeFetch = newFetch;
        },
        configurable: true,
        enumerable: true
      });
    } catch {
      try {
        Object.defineProperty(window, 'fetch', {
          value: originalFetch,
          writable: true,
          configurable: true,
          enumerable: true
        });
      } catch {
        // ignore
      }
    }

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', {
          get() {
            return activeFetch;
          },
          set(newFetch) {
            activeFetch = newFetch;
          },
          configurable: true,
          enumerable: true
        });
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.warn('Fetch polyfill notice:', err);
  }
}

setupFetchPolyfill();
