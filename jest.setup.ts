import '@testing-library/jest-dom';

// Mock uuid module (ESM compatibility)
jest.mock('uuid', () => ({
    v4: () => 'test-uuid-' + Math.random().toString(36).substring(7),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});
