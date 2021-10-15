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

import getRealm from '../../services/realm'

import Chat from './Components/Chat'
import Story from './Components/Story'

import SearchSvgComponent from '../../../assests/images/pages/Home/Search'

let unsubs = []

const chats = []

const Home = ({ navigation }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [modelImageSelected, setModalImageSelected] = useState('');

  const [myProfilePicture, setMyProfilePicture] = useState('https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG')

  const [chats, setChats] = useState([])

  useEffect(() => {
    const run = async () => {
      const realm = await getRealm()
      const me = await realm.objects('User').filtered(`id == '${auth().currentUser.uid}'`)[0]
      setMyProfilePicture(me.profilePicture)

      const chts = realm.objects('Chat')
      setChats(chts)
      console.log('ddddddddddddddddddddddddddddddddd',chts[0].messages)
      const messages = realm.objects('Message')
      const users = realm.objects('User')

      realm.write(async () => {

        for (let chat of chats) {

          const sorted = [
            chat.owners[0].id,
            chat.owners[1].id
          ].sort().join('-')

          const friendId = sorted.replace(auth().currentUser.uid, '').replace('-', '')
          console.log(friendId)

          const friend = realm.objects('User').filtered(`id == '${friendId}'`)

          unsubs.push(
            database()
              .ref(`chats/${sorted}/queues/${auth().currentUser.uid}`)
              .on('value', async snapshot => {
                database().ref(`chats/${sorted}/queues/${auth().currentUser.uid}`).set([])
                  .then(() => console.log('Data set.'));
                if (!snapshot.val()) return
                for (msg of snapshot.val()) {
                  realm.create('contentMessage', {
                    id: await sha256(`${JSON.stringify(msg)}`),
                    type: msg.content.type,
                    value: msg.content.value
                  })
                  const content = realm.objects('contentMessage').filtered(`id == '${sha256(`${JSON.stringify(msg)}`)}'`)[0]
                  realm.create('Message', {
                    from: friend,
                    to: me,
                    timestamp: msg.timestamp,
                    content: content
                  })
                }
              })
          )

        }

      })


    }

    run()

    return () => {
      for (let unsub of unsubs) {
        console.log(unsub)
        unsub()
      }
      unsubs = []
    }

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
              console.log("cgat",chat)
              const friend = chat.owners.filter( user => user.id !== auth().currentUser.uid )[0]
              return (
                <Chat
                  yourUID={auth().currentUser.uid}
                  key={chat.id}
                  picture={
                    friend.profilePicture
                  }
                  name={
                    friend.name
                  }
                  lastMessage={
                    { id:'', timestamp: new Date(2012, 0, 1), content: { type: 'message', value:`                   ` } } 
                  }
                  onPhotoPress={() => {
                    setModalImageSelected(chat.picture)
                    setModalVisible(!modalVisible)
                  }}
                  onChatPress={ async () => {
                    navigation.navigate('Chat', { friend: friend, chatName: [auth().currentUser.uid, friend.id].sort().join('-') })
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