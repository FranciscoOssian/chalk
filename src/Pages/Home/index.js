import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'

import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { sha256 } from 'react-native-sha256';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob-alpha'

import getRealm from '../../services/realm'

import Chat from './Components/Chat'
import Story from './Components/Story'

import SearchSvgComponent from '../../../assests/images/pages/Home/Search'

import firstTimeOpenApp from './utils/getMessagesWithFirebase'

import myDebug from '../../utils/debug/index'

import Core from '../../services/core'

const core = new Core();

const debug = (...p) => myDebug('pages/Home/index.js',p)

let unsubs = []

const Home = ({ navigation }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [modelImageSelected, setModalImageSelected] = useState('');

  const [myProfilePicture, setMyProfilePicture] = useState('https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG')
  const [chats, setChats] = useState([])
  const [flag, setFlag] = useState(false)

  useEffect(() => {

    const run = async () => {
      const realm = await getRealm()
      const me = await core.localDB.get.myUser()
      if (!me) return setFlag(!flag)
      try {
        setMyProfilePicture(me.profilePicture)
      } catch (e) { console.log(e) }
      if ((await AsyncStorage.getItem('firstTimeOpenApp')) !== 'false') await firstTimeOpenApp()
      setChats(realm.objects('Chat'))
      await AsyncStorage.setItem('firstTimeOpenApp', 'false')
    }
    run()
  }, [flag])

  useEffect(() => {
    const run = async () => {
      const realm = await getRealm()
      const me = await core.localDB.get.myUser()

      for (let chat of chats) {

        const sorted = [chat.owners[0].id,chat.owners[1].id].sort().join('-')
        const friendId = sorted.replace(auth().currentUser.uid, '').replace('-', '')
        const friend = realm.objects('User').filtered(`id == '${friendId}'`)[0]

        const unsubscriber = database()
          .ref(`chats/${sorted}/queues/${me.id}`).on('child_added', async snapshot => {
            let resp = snapshot.val()
            if (!resp) return
            if (!Array.isArray(resp)) resp = [resp]
            database().ref(`chats/${sorted}/queues/${me.id}`).set([]).then(() => console.log('Data set.'));
            for (let msg of resp) {
              const sha = await sha256(`${JSON.stringify(msg)}`)
              realm.write(() => {
                realm.create('ContentMessage', {
                  id: sha,
                  contentType: msg.content.type,
                  value: msg.content.value.toString()
                })
                const content = realm.objects('ContentMessage').filtered(`id == '${sha}'`)[0]
                realm.create('Message', {
                  id: sha,
                  from: friend,
                  to: me,
                  timestamp: Date(parseInt(msg.timestamp)),
                  content: content
                })
                chat.messages = [...chat.messages, realm.objects('Message').filtered(`id == '${sha}'`)[0]]
              })
              setChats( [...realm.objects('Chat')] )
            }
          })
        unsubs.push(unsubscriber)
      }

      return () => {
        for (let unsub of unsubs) {
          unsub() 
        }
        unsubs = []
      }

    }

    try { run() } catch (e) { console.log(e) }

  }, [])


  return (
    <View>

      <View style={styles.Head}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Account')}
        >
          <Image
            style={styles.Perfil}
            source={{ uri: myProfilePicture }}
          />
        </TouchableOpacity>
        <Text style={styles.HeadText}>Chats</Text>
      </View>

      <ScrollView style={{ height: '70%' }}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 7 }}
        >
          {
            true ? <></> : <Story picture="https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg" online={false} name="Your Story" />
          }
          {
            [].map(story => <Story key={story.id} picture={story.picture} online={story.online} name={story.name} />)
          }
        </ScrollView>

        {
          chats.map(
            chat => {
              const lastMessage = [...chat.messages].pop()
              const friend = chat.owners.filter(user => user.id !== auth().currentUser.uid)[0]
              const timestamp = chat.messages.length === 0 ? new Date() : lastMessage.timestamp
              const content = chat.messages.length === 0 ? { type: `message`, value: `        ` } : lastMessage.content
              return (
                <Chat
                  yourUID={auth().currentUser.uid}
                  key={chat.id}
                  picture={friend.profilePicture}
                  name={friend.name}
                  lastMessage={{ id: lastMessage?.from.id, timestamp, content }}
                  onPhotoPress={() => {
                    setModalImageSelected(friend.profilePicture)
                    setModalVisible(!modalVisible)
                  }}
                  onChatPress={async () => {
                    navigation.push('Chat', { friendID: friend.id, chatName: [auth().currentUser.uid, friend.id].sort().join('-') })
                  }}
                />
              )
            }
          )
        }

      </ScrollView>

      
      <AdMobBanner
        adSize="fullBanner"
        adUnitID="ca-app-pub-3940256099942544/6300978111"
        testDevices={[AdMobBanner.simulatorId]}
        adViewDidReceiveAd={(a) => console.log("RECEIVED AD " + a)}
        onAdFailedToLoad={error => console.error(error)}
      />

      <View style={{ height: 76, width: '100%', alignItems: 'center' }}>
        <SearchSvgComponent
          onPress={() => navigation.navigate('SearchPerson')}
          primaryColor="#0584FE"
          secondaryColor="rgb(255,255,255)"
        />
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback>
            <Image
              style={{ width: '100%', height: '50%' }}
              source={{ uri: modelImageSelected }}
            />
          </TouchableWithoutFeedback>
        </TouchableOpacity>

      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  Perfil: {
    width: 40,
    height: 40,
    borderRadius: 100,
    margin: 16
  },
  Head: {
    flexDirection: "row",
    alignItems: "center"
  },
  HeadText: {
    letterSpacing: 0.4,
    lineHeight: 38,

    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: "Assistant",
    fontStyle: 'normal'
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Home;