import { signIn, signOut, getCurrentUserofGoogleProvider } from './index.ts';

const mockedUser = {
  foo: 'bee',
  type: 'i am mocked user',
};

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(),
    signIn: jest.fn(() => mockedUser),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(() => mockedUser),
    configure: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

describe('Google SignIn', () => {
  it('Test signIn', async () => {
    const signInResult = await signIn();
    expect(signInResult).toEqual(mockedUser);
  });

  it('Test signOut', async () => {
    await signOut();
  });

  it('Test getCurrentUserofGoogleProvider', async () => {
    const currentUserResult = await getCurrentUserofGoogleProvider();
    expect(currentUserResult).toEqual(mockedUser);
  });
});
