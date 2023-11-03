import { renderHook, act } from '@testing-library/react-hooks';
import useMatchConfig from './index.ts';

// Mock para storageExtended
jest.mock('@src/utils/storageExtended', () => {
  return {
    storageExtended: (tag) => ({
      get: () => Promise.resolve({ from: 18, genders: [], lang: '', to: 18 }),
      set: (value) => {
        return Promise.resolve();
      },
    }),
  };
});

jest.mock('expo-localization', () => {
  return {
    getLocales: () => [{ languageCode: 'en' }],
  };
});

describe('useMatchConfig', () => {
  it('should initialize with default default match config', async () => {
    const { result } = renderHook(() => useMatchConfig());

    // Use act to wrap state updates
    await act(async () => {
      // Wait for any asynchronous operations to complete
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const [matchConfig] = result.current;

    expect(matchConfig).toEqual({
      from: 18,
      to: 18,
      lang: '',
      genders: [],
    });
  });
});
