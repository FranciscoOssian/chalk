import * as React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TextInput } from 'react-native'

import BackScreen from '../../../assests/images/global/navigation'
import VideoCall from '../../../assests/images/global/videoCall'
import VoiceCall from '../../../assests/images/global/voiceCall'
import Audio from '../../../assests/images/pages/Chat/Audio'
import Camera from '../../../assests/images/pages/Chat/Camera'

import Message from './Components/Message'

let lastMessage;

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const yourUID = 'ddd'

const chat = {
  messages: [],
  owners: [
    {
      displayName: 'wdcjbdjc',
      profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG',
      uid: 'eee'
    },
    {
      displayName: 'wedcfwedcf',
      profilePicture: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg',
      uid: 'ddd'
    }
  ]
}

const messages = []

for (let i = 0; i < 100; ++i) {
  let u = Math.random()
  chat.messages.push({
    id: `${u}`,
    from: u > 0.5 ? 'ddd' : 'eee',
    profilePicture: u > 0.5 ? chat.owners[1].profilePicture : chat.owners[0].profilePicture,
    timestamp: randomDate(new Date(2012, 0, 1), new Date()),
    content: `${i}oi${u}bem?`
  })
}

const Chat = () => {
  return (

    <View style={{ height: '100%', justifyContent: 'space-between' }}>

      <View style={styles.header}>
        <BackScreen />
        <View style={styles.content}>
          <Image
            source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
            style={{ width: 45, height: 45, borderRadius: 100 }}
          />
          <View>
            <Text style={[styles.name, styles.font]}>Name</Text>
            <Text style={[styles.status, styles.font]}>Online</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <VoiceCall />
          <VideoCall />
        </View>
      </View>

      <View style={{ height: '79.93%' }}>

        <ScrollView>

          <View style={styles.startChat}>
            <Image
              source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
            <Text style={[styles.startChatPersonName, styles.fontfont]}>Jacob</Text>
            <Text style={[styles.startChatDescription, styles.font]}>You’re on Chat</Text>
            <View style={styles.newFriend}>
              <View style={styles.imageDuo}>
                <Image
                  source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
                  style={[styles.imageDuoImage, { left: 7.5 }]}
                />
                <Image
                  source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
                  style={[styles.imageDuoImage, { left: -7.5 }]}
                />
              </View>
              <Text style={styles.newFriendMessage}>Say hi to your new  friend, Jacob.</Text>
            </View>
          </View>

          {
            chat.messages.map((message, index, e) => {
              const useSpace = chat.messages[index].from != chat.messages[index + 1]?.from
              return (
                <View key={message.id}>
                  <Message
                    from={message.from}
                    timestamp={message.timestamp}
                    content={message.content}
                    profilePicture={message.profilePicture}
                    yourUID='ddd'
                  />
                  {useSpace ? <View style={{ width: '100%', height: 30 }}></View> : <></>}
                </View>
              )
            }

            )
          }

        </ScrollView>

      </View>


      <View style={{ width: '100%', height: '11.3%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
        <Audio/>
        <TextInput
          style={styles.TextInput}
          placeholder="Aa"
        />
        <Camera/>
      </View>

    </View>




  );
};

const styles = StyleSheet.create({
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
    /* identical to box height */

    textAlign: 'center',
    letterSpacing: -0.2,

    color: '#000000',
  },
  startChat: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '25%'
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
    height: '50.3%'
  }
})

export default Chat;