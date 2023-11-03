import { renderHook } from '@testing-library/react-hooks';
import useAsync from './index.ts';

describe('useAsync', () => {
  it('should fetch data and handle loading state', async () => {
    const asyncFunction = jest.fn(() => Promise.resolve('mocked-data'));

    const dependencies = [];

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync({ asyncFunction, dependencies })
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);

    expect(result.current.data).toBe('mocked-data');

    expect(asyncFunction).toHaveBeenCalled();
  });

  it('should handle error when async function fails', async () => {
    const asyncFunction = jest.fn(() => Promise.reject(new Error('Mocked error')));

    const dependencies = [];

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync({ asyncFunction, dependencies })
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);

    expect(result.current.data).toBe(undefined);

    expect(asyncFunction).toHaveBeenCalled();
  });
});
