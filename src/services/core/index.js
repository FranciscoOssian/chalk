import { sha256 } from 'react-native-sha256';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob'
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage';

import getRealm from '../realm'

import myDebug from '../../utils/debug'
const debug = (...p) => myDebug('services/core/index.js', p)

export default class Core {
    constructor() {
        this.cloudAuth = {
            auth: auth,
            create: {
                user: async (email, password) => auth().createUserWithEmailAndPassword(email, password)
            },
        };
        this.cloudStore = {
            databases: {
                files: storage,
                complex: firestore,
                realTime: database
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
                },
                user: async (user) => {
                    firestore().collection('Users').doc(user.id).set(user)
                }
            },
            get: {
                user: async (id) => {
                    return (
                        await firestore().collection('Users').doc(id).get()
                    ).data()
                },
                friends: async (userID) => {
                    const snapshot = await firestore().collection('Users').doc(`${userID}`).collection('friends').doc('friends').get()
                    let friends = snapshot.data()?.friends
                    if( !Array.isArray(friends) ){
                        return [friends]
                    }
                    else return friends
                }
            },
            update: {
                myUser: async (user) => {
                    if (!this.cloudAuth.auth().currentUser) return
                    return this.cloudStore.databases.complex()
                        .collection('Users').doc(
                            this.cloudAuth.auth().currentUser.uid
                        ).set(user)
                },
                myProfilePicture: async (new_path) => {
                    if (!this.cloudAuth.auth().currentUser) return
                    const ref = storage().ref(`users/${this.cloudAuth.auth().currentUser.uid}/profilePicture.jpg`)
                    await ref.putFile(new_path)
                    return await ref.getDownloadURL()
                }
            },
            delete: {
                messageImage: (path) => {
                    let fields = path.split('%2F')
                    const chatName = fields[1]
                    const ownerQueue = fields[2]
                    const fileName = fields[3].split('?alt')[0]
                    storage().ref(`chats/${chatName}/${ownerQueue}/${fileName}`).delete()
                }
            }
        };
        this.localDB = {
            databases: {
                realm: getRealm()
            },
            get: {
                myUser: async () => {
                    const realm = await getRealm();
                    const me = await realm.objects('User').filtered(`id == '${auth().currentUser?.uid}'`)[0]
                    return me;
                },
                user: async (id) => {
                    const realm = await this.localDB.databases.realm;
                    const friend = await realm.objects('User').filtered(`id == '${id}'`)[0]
                    return friend;
                },
                chat: async (id) => {
                    const realm = await getRealm();
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
                    const prev = realm.objects('Message').filtered(`id == '${sha}'`)[0]
                    if (prev) return prev
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
                        const chat = realm.objects('Chat').filtered(`id == '${chatName}'`)[0]
                        chat.messages = [...chat.messages, realm.objects('Message').filtered(`id == '${sha}'`)[0]]
                    })
                    return realm.objects('Message').filtered(`id == '${sha}'`)[0]
                },
                user: async (user) => {
                    const realm = await this.localDB.databases.realm;
                    const prev = realm.objects('User').filtered(`id == '${user.id}'`)[0]
                    if (prev) return prev
                    realm.write(() => realm.create('User', user))
                },
                chat: async (chat) => {
                    const realm = await this.localDB.databases.realm;
                    const prev = realm.objects('Chat').filtered(`id == '${chat.id}'`)[0]
                    if (prev) return prev
                    realm.write(() => {
                        realm.create('Chat', chat)
                    })
                },
                image: async (url) => {
                    if (url.includes('https://')) {
                        console.log(RNFetchBlob.fs.dirs.PictureDir + '/Chatalk')
                        const res = await RNFetchBlob.config({
                            fileCache: true,
                            path : RNFetchBlob.fs.dirs.PictureDir + '/Chatalk/' + await sha256(url) + '.png'
                        }).fetch('GET', url)
                        return 'file://' + res.path()
                    }
                    else{
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
                }
            },
            delete: {
                myUser: () => { },
                message: (id) => { },
                friend: (id) => { },
                chat: (id) => { },
                allDataBase: async () => {
                    const realm = await getRealm();
                    realm.write(() => {
                        const arr = [
                            realm.objects('Chat'),
                            realm.objects('User'),
                            realm.objects('Message'),
                            realm.objects('ContentMessage'),
                        ]
                        for (let realmList of arr) {
                            for (let realmObj of realmList) {
                                realm.delete(realmObj)
                            }
                        }
                    })
                }
            },
            update: {
                myUser: async (config) => {
                    if (!config) return
                    const realm = await getRealm();
                    const me = await this.localDB.get.myUser()
                    realm.write(() => {
                        const result = Object.keys(config).map(
                            (key) => {
                                return { key: key, value: config[key] }
                            }
                        )
                        for (let i of result) {
                            me[i.key] = i.value
                        }
                    })
                }
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
                            debug(resp)
                            for (let msg of resp) {
                                callback(msg) 
                            }
                        })
            }
        }
    }

    authPhoneNumber() {

        async function verifyPhoneNumber(phone) {
            return auth().verifyPhoneNumber(phone);
        }
        async function confirmCode(confirm, code) {
            const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
            await auth().currentUser.linkWithCredential(credential);
        }


        return { verifyPhoneNumber, confirmCode }
    }

    async receiveMessage(message) {

        let value = message.content.value
        
        if (message.content.type === 'image'){
            const rnfb = RNFetchBlob
            const picDir = rnfb.fs.dirs.PictureDir
            const folders = await rnfb.fs.ls(picDir)
            const found = folders.find(folder => folder === 'Chatalk');
            if (!found) await rnfb.fs.mkdir(picDir + '/Chatalk')
            
            value = await this.localDB.create.image(message.content.value)
            this.cloudStore.delete.messageImage(message.content.value)
        }

        await this.localDB.create.message({
            content: {
                value: value,
                type: message.content.type
            },
            from: message.from,
            to: message.to,
            timestamp: message.timestamp
        })
    }

    async signUp(email, password) {
        const userCredential = await this.cloudAuth.create.user(email, password)
        const data = {
            name: 'Anon',
            age: 18,
            email: email,
            id: userCredential.user.uid,
            bio: '',
            profilePicture: 'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/public%2FdefaultProfilePicture.jpg?alt=media&token=ac1c66c3-903e-482b-8cce-4d945b2159c1'
        }
        this.localDB.create.user(data)
        await this.cloudStore.create.user(data)
    }

    async signIn(email, password) {
        const userCredentials = await auth().signInWithEmailAndPassword(email, password)
        const myUser = await this.cloudStore.get.user(userCredentials.user.uid)
        await this.localDB.create.user({
            ...myUser,
            id: userCredentials.user.uid,
        })
    }

    async sendMessage(message) {

        if (message.content.value === '') return

        const sha = await sha256(`${JSON.stringify(message)}${Date.now()}`)
        const chatName = [auth().currentUser.uid, message.to.id].sort().join('-')

        const rnfb = RNFetchBlob
        const picDir = rnfb.fs.dirs.PictureDir
        const folders = await rnfb.fs.ls(picDir)
        const found = folders.find(folder => folder === 'Chatalk');
        if (!found) await rnfb.fs.mkdir(picDir + '/Chatalk')

        let reference
        let newUri

        if (message.content.type === 'image') {
            newUri = await this.localDB.create.image(message.content.value)
            reference = storage().ref(`chats/${chatName}/${message.to.id}/${sha}.png`)
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
                value: message.content.type === 'image' ? newUri.uri : message.content.value
            }
        }

        await this.localDB.create.message(msgToLocal)
        await this.cloudStore.create.message(msg)
    }
}