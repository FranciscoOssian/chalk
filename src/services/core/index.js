import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { sha256 } from 'react-native-sha256';

import getRealm from '../realm'

export default class Core {
    constructor() {
        this.auth = {
            ...auth
        };
        this.cloudStore = {
            fileStore: null,
            jsonStore: database
        };
        this.localDB = {
            databases: {
                realm: getRealm()
            },
            get: {
                myUser: async () => {
                    const realm = await getRealm();
                    const me = await realm.objects('User').filtered(`id == '${auth().currentUser.uid}'`)[0]
                    return me;
                },
                user: async (id) => {
                    const realm = await getRealm();
                    const friend = await realm.objects('User').filtered(`id == '${id}'`)[0]
                    return friend;
                },
                chat: (id) => { },
                message: (id) => realm.objects('Message').filtered(`id == '${id}'`)[0]
            },
            create: {
                message: async (message, callback) => { 
                    const realm = await getRealm();
                    const sha = await sha256(`${JSON.stringify(msg)}`)
                    realm.write(() => {
                        realm.create('ContentMessage', {
                            id: sha,
                            contentType: message.content.type,
                            value: message.content.value.toString()
                        })
                        const content = realm.objects('ContentMessage').filtered(`id == '${sha}'`)[0]
                        realm.create('Message', {
                            id: sha,
                            from: message.from,
                            to: message.to,
                            timestamp: Date(parseInt(message.timestamp)),
                            content: content
                        })
                        callback ( this.localDB.get.message(sha) )
                    })
                },
                user: (user) => { },
                chat: (chat) => { }
            },
            delete: {
                myUser: () => { },
                message: (id) => { },
                friend: (id) => { },
                chat: (id) => { }
            }
        };
        this.events = {
            onMessageReceived: async (config, callback) => {
                const me = await this.localDB.get.myUser()
                chatPath = `chats/${config.chatName}/queues/${me.id}`
                return database()
                    .ref(chatPath).on('child_added',
                    async snapshot => {
                        let resp = snapshot.val()
                        if (!resp) return
                        if (!Array.isArray(resp)) resp = [resp]
                        database().ref(chatPath).set([]).then(() => console.log('Data set.'));
                        for (let msg of resp) {
                            callback(msg)
                        }
                    })
            }
        }
    }
}