import { renderHook } from '@testing-library/react-hooks';
import useFirstTimeCheck from './index.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('useFirstTimeCheck', () => {
  it('should return true on the first run', async () => {
    // Mock AsyncStorage.getItem to return null, indicating the first run
    AsyncStorage.getItem.mockResolvedValue(null);

    const { result, waitForNextUpdate } = renderHook(() => useFirstTimeCheck('someId'));

    // Wait for the useEffect to complete
    await waitForNextUpdate();

    expect(result.current).toBe(true);

    // Check if AsyncStorage.setItem was called
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@first_time/someId', 'done');
  });

  it('should return false on subsequent runs', async () => {
    // Mock AsyncStorage.getItem to return a value, indicating a subsequent run
    AsyncStorage.getItem.mockResolvedValue('done');
    AsyncStorage.setItem.mockClear(); // Reset the mock function

    const { result, waitForNextUpdate } = renderHook(() => useFirstTimeCheck('someId'));

    // Wait for the useEffect to complete
    await waitForNextUpdate();

    expect(result.current).toBe(false);

    // Ensure that AsyncStorage.setItem is not called on subsequent runs
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
