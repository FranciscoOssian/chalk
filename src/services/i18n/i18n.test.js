import fabric from './index.js';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: () => 'en',
}));

// Mock de i18n.use
jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
}));

jest.mock('@utils/defaultStorage.ts', () => ({
  defaultAppLanguage: 'en',
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
