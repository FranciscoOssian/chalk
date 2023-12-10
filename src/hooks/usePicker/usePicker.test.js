import { renderHook, act } from '@testing-library/react-hooks';
import usePicker from './index.ts';

jest.mock('expo-file-system', () => ({
  documentDirectory: 'mocked-document-directory',
  moveAsync: jest.fn().mockResolvedValue(),
  deleteAsync: jest.fn().mockResolvedValue(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    uri: 'selected-image-uri',
    fileName: 'image-file-name',
    canceled: false,
    assets: [{ uri: 'selected-image-uri' }],
  }),
  MediaTypeOptions: {
    All: [],
  },
}));

describe('usePicker', () => {
  it('should not throw an error when executing pick()', async () => {
    const { result } = renderHook(() => usePicker());

    const [, pickImage] = result.current;

    await act(async () => {
      await pickImage({ propagate: true });
    });
  });
});
