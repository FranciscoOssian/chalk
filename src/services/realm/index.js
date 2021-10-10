import Realm from 'realm'

import messageSchema from '../../schemas/MessageSchema'
import userSchema from '../../schemas/UserSchema'
import myUserSchema from '../../schemas/MyUserSchema'

export default function getRealm() {
    return Realm.open({
        schema: [userSchema, messageSchema, myUserSchema],
    })
}