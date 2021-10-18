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

import getRealm from '../../services/realm'

import Chat from './Components/Chat'
import Story from './Components/Story'

import SearchSvgComponent from '../../../assests/images/pages/Home/Search'

import firstTimeOpenApp from './utils/reload'

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

      const me = await realm.objects('User').filtered(`id == '${auth().currentUser.uid}'`)[0]
      
      if (!me) return setFlag(!flag)
      
      try {
        setMyProfilePicture(me.profilePicture)
      } catch (e) { console.log(e) }
      
      if ((await AsyncStorage.getItem('firstTimeOpenApp')) !== 'false') await firstTimeOpenApp()
      
      setChats(realm.objects('Chat'))

      await AsyncStorage.setItem('firstTimeOpenApp', 'false')

      realm.write(async () => {
        for (let chat of chats) {

          const sorted = [
            chat.owners[0].id,
            chat.owners[1].id
          ].sort().join('-')

          const friendId = sorted.replace(auth().currentUser.uid, '').replace('-', '')
          const friend = realm.objects('User').filtered(`id == '${friendId}'`)

          const unsubscriber = database()
            .ref(`chats/${sorted}/queues/${me.id}`)
            .on('value', async snapshot => {
              database().ref(`chats/${sorted}/queues/${me.id}`).set([]).then(() => console.log('Data set.'));
              if (!snapshot.val()) return
              for (msg of snapshot.val()) {
                realm.create('ContentMessage', {
                  id: await sha256(`${JSON.stringify(msg)}`),
                  type: msg.content.type,
                  value: msg.content.value
                })
                const content = realm.objects('ContentMessage').filtered(`id == '${sha256(`${JSON.stringify(msg)}`)}'`)[0]
                realm.create('Message', {
                  id: await sha256(`${JSON.stringify(msg)}`),
                  from: friend,
                  to: me,
                  timestamp: Date(parseInt(msg.timestamp)),
                  content: content
                })

              }
            })

          unsubs.push(unsubscriber)
        }
      })

      return () => {
        for (let unsub of unsubs) {
          console.log(unsub)
          unsub()
        }
        unsubs = []
      }
      
    }

    try { run() } catch (e) { console.log(e) }

  }, [flag])


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
              const friend = chat.owners.filter(user => user.id !== auth().currentUser.uid)[0]
              const id = chat.messages.length === 0 ? `` : chat.messages[chat.messages.length - 1].id
              const timestamp = chat.messages.length === 0 ? new Date() : chat.messages[chat.messages.length - 1].timestamp
              const content = chat.messages.length === 0 ? { type: `message`, value:`        ` } : chat.messages[chat.messages.length - 1].content
              return (
                <Chat
                  yourUID={auth().currentUser.uid}
                  key={chat.id}
                  picture={friend.profilePicture}
                  name={friend.name}
                  lastMessage={ { id, timestamp, content }}
                  onPhotoPress={() => {
                    setModalImageSelected(chat.picture)
                    setModalVisible(!modalVisible)
                  }}
                  onChatPress={async () => {
                    navigation.navigate('Chat', { friendID: friend.id, chatName: [auth().currentUser.uid, friend.id].sort().join('-') })
                  }}
                />
              )
            }
          )
        }

      </ScrollView>

      <View style={{ height: 76, width: '100%', backgroundColor: 'blue' }}>
        <Text>AdSense place</Text>
      </View>

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