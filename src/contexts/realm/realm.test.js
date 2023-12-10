import realmContext from './index.js';

jest.mock('@realm/react', () => {
  return {
    createRealmContext: () => ({
      useRealm: () => {},
      useQuery: () => {},
      useObject: null,
      RealmProvider: null,
    }),
  };
});

describe('useRealm', () => {
  it('should use the Realm context', async () => {
    expect(realmContext).toHaveProperty('useRealm');
  });
});
