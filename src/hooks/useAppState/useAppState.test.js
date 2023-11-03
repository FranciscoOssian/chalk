import { renderHook, act } from '@testing-library/react-hooks';
import useAppState from './index.ts';
import { AppState } from 'react-native';

describe('useAppState', () => {
  it('should return true when app state is active', () => {
    // Defina o estado do aplicativo para 'active' antes de renderizar o hook
    AppState.currentState = 'active';

    const { result } = renderHook(() => useAppState());

    const appStateVisible = result.current;

    expect(appStateVisible).toBe(true);
  });

  it('should return false when app state is background', () => {
    // Defina o estado do aplicativo para 'background' antes de renderizar o hook
    AppState.currentState = 'background';

    const { result } = renderHook(() => useAppState());

    const appStateVisible = result.current;

    expect(appStateVisible).toBe(false);
  });
});
