import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import { sha256 } from 'react-native-sha256';

import getRealm from '../../../services/realm'

export default async function () {

    const realm = await getRealm()
    const me = await realm.objects('User').filtered(`id == '${auth().currentUser.uid}'`)[0]

    console.log('entrou')
    const snapshot = await firestore().collection('Users').doc(`${me.id}`).collection('friends').doc('friends').get()
    const friends = snapshot.data()?.friends

    if(!friends) return

    for (let friendID of friends) {
        const friendSnapShot = await firestore().collection('Users').doc(`${friendID}`).get()
        const friend = friendSnapShot.data()

        const chatName = [friend.id, me.id].sort().join('-')

        const queuedMessagesSnapShot = await database().ref(`chats/${chatName}/queues/${me.id}`).once('value')

        realm.write(() => {
            try {
                realm.create('User', {
                    name: friend.name,
                    age: friend.age,
                    email: friend.email,
                    bio: friend.bio,
                    profilePicture: friend.profilePicture,
                    id: friend.id
                })
                const realmFriend = realm.objects('User').filtered(`id == '${friendID}'`)[0]
                realm.create('Chat', {
                    id: chatName,
                    owners: [realmFriend, me],
                    messages: []
                })
            } catch (e) { console.log(e) }
        })

        const realmChat = realm.objects('Chat').filtered(`id == '${chatName}'`)[0]
        let queue = queuedMessagesSnapShot.val() === null ? [] : queuedMessagesSnapShot.val()
        if (!Array.isArray(queue)) queue = [queue]
        const realmFriend = realm.objects('User').filtered(`id == '${friendID}'`)[0]

        for (let msg of queue) {
            const sha = await sha256(`${JSON.stringify(msg)}`)
            console.log("msg", msg, sha)
            realm.write(() => {
                try {
                    realm.create('ContentMessage', {
                        id: sha,
                        contentType: msg.content.type,
                        value: msg.content.value
                    })
                    const realmContentMessage = realm.objects('ContentMessage').filtered(`id == '${sha}'`)[0]
                    realm.create('Message', {
                        id: sha,
                        timestamp: new Date(parseInt(msg.timestamp)),
                        to: me,
                        from: realmFriend,
                        content: realmContentMessage
                    })
                    const newMessage = realm.objects('Message').filtered(`id == '${sha}'`)[0]
                    realmChat.messages = [...realmChat.messages, newMessage]
                } catch (e) { console.log(e) }
            })
        }
        await database().ref(`chats/${chatName}/queues/${me.id}`).set([])
    }
}