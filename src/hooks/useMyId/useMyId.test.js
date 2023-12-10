import { renderHook } from '@testing-library/react-hooks';
import useMyId from './index.ts'; // Substitua pelo caminho real para o seu arquivo useMyId

// Mock AsyncStorage para o teste
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mocked-user-id')),
}));

describe('useMyId', () => {
  it('should return the user ID from AsyncStorage', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMyId());

    // O resultado inicial deve ser nulo antes da resolução da promessa
    expect(result.current).toBeNull();

    // Aguarde até que a promessa seja resolvida
    await waitForNextUpdate();

    // O resultado deve ser a ID do usuário simulada
    expect(result.current).toBe('mocked-user-id');
  });
});
