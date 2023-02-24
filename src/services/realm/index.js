import Realm from 'realm';

import chatSchema from './schemas/chatSchema';
import contentMessageSchema from './schemas/contentMessageSchema';
import messageSchema from './schemas/messageSchema';
import userSchema from './schemas/userSchema';

export default function getRealm() {
  return Realm.open({
    schema: [userSchema, messageSchema, chatSchema, contentMessageSchema],
  });
}
