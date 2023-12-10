import { renderHook } from '@testing-library/react-hooks';
import useUser from './index.ts';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: async () => '12345',
}));

jest.mock('@contexts/realm', () => ({
  useQuery: () => ({
    filtered: (query) => {
      if (query === `id == '12345'`) {
        return [
          {
            id: '12345',
            name: 'John Doe',
          },
        ];
      } else {
        return [
          {
            id: '54321',
            name: 'Lohn Weleps',
          },
        ];
      }
    },
  }),
}));

describe('useUser', () => {
  it('should fetch current user information when priorityUserId is not provided', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();
    const user = result.current;

    expect(user).toEqual({
      id: '12345',
      name: 'John Doe',
    });
  });

  it('should fetch another user information when priorityUserId is provided', async () => {
    const { result } = renderHook(() => useUser('54321'));

    const user = result.current;

    expect(user).toEqual({
      id: '54321',
      name: 'Lohn Weleps',
    });
  });
});
