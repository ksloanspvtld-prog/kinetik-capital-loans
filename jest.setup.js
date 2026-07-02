import "@testing-library/jest-dom";

// ✅ Mock fetch (if needed)
global.fetch = jest.fn();

// ✅ Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// ✅ Mock console.error (테스트 중 console clutter कमी करण्यासाठी)
global.console.error = jest.fn();