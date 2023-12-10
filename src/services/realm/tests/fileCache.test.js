import { fileCache, setFileCache, deleteFile } from '../fileCache/index.ts';
import Realm from 'realm';
import schemas from '../schemas/index.js';

jest.mock('@src/utils/sha256', () => () => 'sha256-mocked');

jest.mock('expo-file-system', () => ({
  documentDirectory: 'docDir-mocked',
  downloadAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

describe('File Cache Management', () => {
  let realm;

  beforeAll(() => {
    realm = new Realm({
      inMemory: true,
      schema: schemas,
      path: '/tmp/test.realm',
    });
  });

  afterAll(() => {
    realm.close();
  });

  it('should create and read file', async () => {
    const cachedFile = await setFileCache('https://kdkdkdd.com', realm);

    const expectedDestination = `docDir-mocked/sha256-mocked`;
    expect(cachedFile).toEqual({ path: expectedDestination });
  });

  it('should create, read and update file', async () => {
    const cachedFile = await setFileCache('https://kdkdkdd.com', realm);
    const expectedDestination = `docDir-mocked/sha256-mocked`;
    expect(cachedFile).toEqual({ path: expectedDestination });

    const refreshedFile = await fileCache('https://kdkdkdd.com', realm, true);

    expect(refreshedFile).toEqual({ path: expectedDestination });
  });

  it('should create, read and delete file', async () => {
    expect('no del file for realm and FS found').toBe(0);
  });
});
