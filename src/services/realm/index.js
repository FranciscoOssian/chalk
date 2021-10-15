import Realm from 'realm'

import messageSchema from '../../schemas/MessageSchema'
import userSchema from '../../schemas/UserSchema'
import contentMessageSchema from '../../schemas/ContentMessageSchema'
import myUserSchema from '../../schemas/MyUserSchema'
import chatSchema from '../../schemas/ChatSchema'

export default function getRealm() {
    return Realm.open({
        schema: [userSchema, messageSchema, myUserSchema, chatSchema, contentMessageSchema],
    })
}