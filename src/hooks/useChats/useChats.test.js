import * as realmContext from '@contexts/realm'; // Import your realm context
import { renderHook } from '@testing-library/react-hooks';
import useChats from './index.ts';

// Mock your realm context module
jest.mock('@contexts/realm', () => ({
  useQuery: jest.fn(),
}));

describe('useChats', () => {
  it('should return chats from realm context', () => {
    const chatData = [{ id: '1', name: 'Chat 1' }, { id: '2', name: 'Chat 2' }];
    
    // Mock the useQuery function to return chatData
    realmContext.useQuery.mockReturnValue(chatData);
    
    const { result } = renderHook(() => useChats());
    
    // Assert that the result matches the data from the context
    expect(result.current).toEqual(chatData);
  });
});
