import "@testing-library/jest-dom/vitest";

// Mock ResizeObserver for React Flow in jsdom environment
if (typeof window !== "undefined" && !window.ResizeObserver) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = MockResizeObserver;
  global.ResizeObserver = MockResizeObserver;
}
