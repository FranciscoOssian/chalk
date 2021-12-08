import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { sha256 } from 'react-native-sha256';
import storage from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob'

import getRealm from '../realm'

import myDebug from '../../utils/debug'
const debug = (...p) => myDebug('services/core/index.js', p)

export default class Core {
    constructor() {
        this.auth = {
            ...auth
        };
        this.cloudStore = {
            databases: {
                firebaseCloudStore: storage,
                realTimeDataBase: database
            },
            create: {
                message: async (message) => {
                    const chatName = [message.from.id, message.to.id].sort().join('-')
                    database().ref(`chats/${chatName}/queues/${message.to.id}`).once('value')
                        .then(snapshot => {
                            const prev = snapshot.val() ? snapshot.val() : []
                            database().ref(`chats/${chatName}/queues/${message.to.id}`).set([...prev, {
                                content: {
                                    type: message.content.type,
                                    value: message.content.value,
                                },
                                timestamp: Date.now(),
                            }])
                        });
                }
            },
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
                    const realm = await this.localDB.databases.realm;
                    const friend = await realm.objects('User').filtered(`id == '${id}'`)[0]
                    return friend;
                },
                chat: async (id) => {
                    const realm = await this.localDB.databases.realm;
                    return realm.objects('Chat').filtered(`id == '${id}'`)[0]
                },
                message: async (id) => {
                    const realm = await this.localDB.databases.realm;
                    return await realm.objects('Message').filtered(`id == '${id}'`)[0]
                }
            },
            create: {
                message: async (message) => {
                    const chatName = [message.from.id, message.to.id].sort().join('-')
                    const realm = await this.localDB.databases.realm;
                    const sha = await sha256(`${JSON.stringify(message)}`)
                    realm.write( () => {
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
                        const chat  = realm.objects('Chat').filtered(`id == '${chatName}'`)[0]
                        chat.messages = [...chat.messages, realm.objects('Message').filtered(`id == '${sha}'`)[0]]
                    })
                    return realm.objects('Message').filtered(`id == '${sha}'`)[0]
                },
                user: (user) => { },
                chat: (chat) => { },
                image: async (url) => {
                    return ImageResizer.createResizedImage(
                        url,
                        600,
                        600,
                        'PNG',
                        100,
                        0,
                        RNFetchBlob.fs.dirs.PictureDir + '/Chatalk'
                    )
                }
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

    async sendMessage(message) {

        if (message.content.value === '') return
        
        const sha = await sha256(`${JSON.stringify(message)}${Date.now()}`)
        const chatName = [auth().currentUser.uid, message.to.id].sort().join('-')

        //try{
        //  RNFetchBlob.fs.mkdir(RNFetchBlob.fs.dirs.PictureDir + '/Chatalk')
        //}
        //catch(e){}

        let reference
        let newUri

        if (message.content.type === 'image') {
            newUri = await this.localDB.create.image(message.content.value)
            reference = storage().ref(`chats/${chatName}/${message.to.id}/${sha}.png`);
            await reference.putFile(newUri.uri)
        }

        let value = message.content.type === 'image' ? await reference.getDownloadURL() : message.content.value

        if (message.content.type === 'image' && reference) value = await reference.getDownloadURL()
        else if (message.content.type === 'message') value = message.content.value
        else return

        const msg = {
            content: {
                type: message.content.type,
                value: value
            },
            to: message.to,
            from: message.from,
            time: new Date(),
        }

        const msgToLocal = {
            ...msg,
            content: {
                type: message.content.type,
                value: message.content.type === 'image'? newUri.uri : message.content.value
            }
        }

        await this.localDB.create.message(msgToLocal)
        await this.cloudStore.create.message(msg)
    }
}