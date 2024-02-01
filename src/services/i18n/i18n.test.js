import fabric from './index.js';

// Mock de localStorage
jest.mock('../localStorage', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    get: jest.fn(() => 'en'),
  })),
}));

// Mock de i18n.use
jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
}));

// Mock de initReactI18next
jest.mock('react-i18next', () => ({
  initReactI18next: jest.fn(),
}));

describe('fabric', () => {
  it('should initialize i18n', async () => {
    await fabric();
  });
});
