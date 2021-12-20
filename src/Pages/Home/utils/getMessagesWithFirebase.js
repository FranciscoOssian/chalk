import database from '@react-native-firebase/database'

import Core from '../../../services/core'

const core = new Core()

export default async function () {

    const me = await core.localDB.get.myUser()
    const friends = await core.cloudStore.get.friends(me.id)

    for (let friendID of friends) {

        const friend = await core.cloudStore.get.user(friendID)
        const chatName = [friendID, me.id].sort().join('-')
        const queuedMessagesSnapShot = await database().ref(`chats/${chatName}/queues/${me.id}`).once('value')

        await core.localDB.create.user({
            name: friend.name,
            age: friend.age,
            email: friend.email,
            bio: friend.bio,
            profilePicture: friend.profilePicture,
            id: friendID
        })

        const friendDB = await core.localDB.get.user(friendID)

        await core.localDB.create.chat({
            id: chatName,
            owners: [friendDB, me],
            messages: []
        })

        let queue = queuedMessagesSnapShot.val() === null ? [] : queuedMessagesSnapShot.val()
        if (!Array.isArray(queue)) queue = [queue]

        for (let msg of queue) {
            await core.receiveMessage({
                content: msg.content,
                from: friendDB,
                to: me
            })

        }

        await database().ref(`chats/${chatName}/queues/${me.id}`).set([])
    }
}