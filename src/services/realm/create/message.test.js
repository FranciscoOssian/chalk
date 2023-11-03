import createMessage from './message.ts';
import Realm from 'realm';

jest.mock('realm', () => ({
  objectForPrimaryKey: (type, _) => {
    if (type === 'Message') {
      return {
        id: 'string-mocked-id',
        from: 'string-mocked-from',
        to: 'string-mocked-to',
        timestamp: '2023-11-03T13:44:15.160Z',
        content: {
          contentType: 'string-mocked-type',
          value: 'string-mocked-value',
        },
      };
    }
    if (type === 'Chat') {
      return {
        id: 'string-mocked-id',
        owners: [{}, {}],
        messages: [],
        lastMessage: {},
      };
    }
  },
  write: jest.fn(),
  create: jest.fn(),
}));

describe('createMessage', () => {
  it('should create a new message', async () => {
    const messageData = {
      from: 'user1',
      to: 'user2',
      content: {
        value: 'Hello, world!',
        type: 'text',
      },
    };

    const createdMessage = await createMessage(Realm, messageData);

    expect(createdMessage).toEqual({
      id: 'string-mocked-id',
      from: 'string-mocked-from',
      to: 'string-mocked-to',
      timestamp: '2023-11-03T13:44:15.160Z',
      content: { contentType: 'string-mocked-type', value: 'string-mocked-value' },
    });
  });
});
