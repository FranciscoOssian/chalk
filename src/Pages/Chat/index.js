import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native'

import RNFetchBlob from 'rn-fetch-blob'
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { sha256 } from 'react-native-sha256';

import getRealm from '../../services/realm';

import BackScreen from '../../../assests/images/global/navigation'
import VideoCall from '../../../assests/images/global/videoCall'
import VoiceCall from '../../../assests/images/global/voiceCall'
import Audio from '../../../assests/images/pages/Chat/Audio'
import Camera from '../../../assests/images/pages/Chat/Camera'

import Message from './Components/Message'

import myDebug from '../../utils/debug/index'
const debug = (...p) => myDebug('pages/Chat/index.js', p)

const Chat = ({ route, navigation }) => {

  const scrollViewRef = useRef();

  const { friendID, chatName } = route.params;

  const [friend, setFriend] = useState({
    profilePicture: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg'
  });

  const [myUser, setMyUser] = useState({
    profilePicture: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg'
  })

  const [messages, setMessages] = useState([])

  const [inputMessage, setInputMessage] = useState({type:'',value:''})

  useEffect(() => {
    const run  = async () => {
      const chatName = [auth().currentUser.uid, friendID].sort().join('-')
      const realm = await getRealm()
      setMyUser( realm.objects('User').filtered(`id == '${auth().currentUser.uid}'`)[0]  )
      setFriend( realm.objects('User').filtered(`id == '${friendID}'`)[0]                )
      const messages = realm.objects('Chat').filtered(`id == '${chatName}'`)[0].messages
      setMessages( messages )
    }
    run()
  }, [])

  const onHandleMessageSend = async (message) => {

    if(message.value === '') return

    debug('message to send', message)

    const realm = await getRealm()
    const sha = await sha256(`${JSON.stringify(message)}${Date.now()}`)
    const chatName = [auth().currentUser.uid, friendID].sort().join('-')
    
    realm.write(  () => {
      realm.create('ContentMessage', {
        id: sha,
        contentType: message.type,
        value: message.value
      })
      const date = new Date()
      const content = realm.objects('ContentMessage').filtered(`id == '${sha}'`)[0]
      realm.create('Message', {
        id: sha,
        from: myUser,
        to: friend,
        content: content,
        timestamp: date
      })
      const newMessage = realm.objects('Message').filtered(`id == '${sha}'`)[0]
      const chat = realm.objects('Chat').filtered(`id == '${chatName}'`)[0]
      chat.messages = [...chat.messages, newMessage]
      database().ref(`chats/${chatName}/queues/${friendID}`).once('value')
      .then(snapshot => {
        const prev = snapshot.val()? snapshot.val() : []
        debug('chat name: ',chatName, 'friend id:', friendID)
        database().ref(`chats/${chatName}/queues/${friendID}`).set([...prev, {
          content:{
            type: content.contentType,
            value: content.value,
          },
          timestamp: Date.now(),
        }])
      });
    })
  }

  return (
    <>
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.push('Home')}
        ><BackScreen />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
        >
          <View
            style={styles.content}
          >
            <Image
              source={{ uri: friend.profilePicture }}
              style={{ width: 45, height: 45, borderRadius: 100 }}
            />
            <View>
              <Text style={[styles.name, styles.font]}>{friend.name}</Text>
              <Text style={[styles.status, styles.font]}>Online</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <VoiceCall />
          <VideoCall />
        </View>

      </View>
      
      <ScrollView 
        style={styles.scrollView}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
      >

        <View style={styles.startChat}>
          <Image
            source={{ uri: myUser.profilePicture }}
            style={{ width: 100, height: 100, borderRadius: 100 }}
          />
          <Text style={[styles.startChatPersonName, styles.fontfont]}>{myUser.name}</Text>
          <Text style={[styles.startChatDescription, styles.font]}>You’re on Chat</Text>
          <View style={styles.newFriend}>
            <View style={styles.imageDuo}>
              <Image
                source={{ uri: friend.profilePicture }}
                style={[styles.imageDuoImage, { left: 7.5 }]}
              />
              <Image
                source={{ uri: myUser.profilePicture }}
                style={[styles.imageDuoImage, { left: -7.5 }]}
              />
            </View>
            <Text style={styles.newFriendMessage}>Say hi to your new  friend, {friend.name}.</Text>
          </View>
        </View>
        {
          messages.map(
            (message, index, e) => {
              const useSpace = messages[index].from != messages[index + 1]?.from
              return (
                <View key={message.id}>
                  <TouchableOpacity
                    onPress={() => message.content.type === 'image' ? Alert.alert('img') : console.log('text')}
                    activeOpacity={0.6}
                  >
                    <Message
                      from={message.from}
                      timestamp={message.timestamp}
                      content={message.content}
                      profilePicture={message.from.profilePicture}
                      yourUID={myUser.id}
                    />
                  </TouchableOpacity>
                  {useSpace ? <View style={{ width: '100%', height: 30 }}></View> : <></>}
                </View>
              )
            }

          )
        }
      </ScrollView>
      <View style={styles.inputMessageContainer}>
        <Audio />
        <Camera
          onPress={ async () => {
            launchImageLibrary({
              mediaType: 'photo',
              includeBase64: true
            }, result => {
              if(result.didCancel) return
              setInputMessage( { type: 'image', value: result.assets[0].base64 } )
              onHandleMessageSend( { type: 'image', value: result.assets[0].base64 } )
            } );
          } }
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Aa"
          multiline={true}
          onChangeText={ (txt) => setInputMessage({ type:'message', value: txt }) }
          value={inputMessage.value}
        />
        <BackScreen
          onPress={ async () => {
            await onHandleMessageSend(inputMessage)
            setInputMessage({ type:'', value:'' })
          } }
        />
      </View>
    </>

  )
}

export default Chat

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 100,
  },
  font: {
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: '#000000',
  },
  status: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: 'rgba(0, 0, 0, 0.35)',
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 19,
    paddingRight: 19,

    width: '100%',

    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    width: '60%',

    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    width: '19%',
    height: '70%',

    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startChatPersonName: {
    fontSize: 24,
    lineHeight: 31,
    textAlign: 'center',
    letterSpacing: 0.33,

    color: '#000000',

  },
  startChatDescription: {
    fontSize: 15,
    lineHeight: 20,

    textAlign: 'center',
    letterSpacing: -0.2,

    color: '#000000',
  },
  startChat: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '25%',

    marginBottom: 100,
  },
  imageDuo: {
    flexDirection: 'row',
  },
  imageDuoImage: {
    width: 48,
    height: 48,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white'
  },
  newFriend: {
    alignItems: 'center',
  },
  newFriendMessage: {
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 16,

    textAlign: 'center',
    letterSpacing: -0.01,

    color: 'rgba(0, 0, 0, 0.3)'
  },
  TextInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 18,

    width: '71.2%',

    height: '100%'
  },
  inputMessageContainer:{
    width: '100%',
    height: 'auto',
    maxHeight: '50%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',

    paddingHorizontal: 20
  }
})
