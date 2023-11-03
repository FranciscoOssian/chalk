import { renderHook, act } from '@testing-library/react-hooks';
import useDeleteDatabase from './useDelRealm.js';

// Mock para useRealm
jest.mock('@realm/react', () => ({
  useRealm: () => ({
    write: jest.fn(),
    objects: jest.fn(() => ({ length: 0 })),
    delete: jest.fn(),
  }),
}));

describe('useDeleteDatabase', () => {
  it('should delete all database objects', async () => {
    const { result } = renderHook(() => useDeleteDatabase());

    const { deleteDatabase } = result.current;

    await act(async () => {
      await deleteDatabase();
    });

    const { isDeleting, isDeleted } = result.current;

    expect(isDeleting).toBe(false);
    expect(isDeleted).toBe(true);
  });
});
