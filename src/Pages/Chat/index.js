import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native'

import BackScreen from '../../../assests/images/global/navigation'
import VideoCall from '../../../assests/images/global/videoCall'
import VoiceCall from '../../../assests/images/global/voiceCall'

const Chat = () => {
  return (

    <View style={styles.container}>

      <BackScreen />

      <View style={styles.content}>

        <Image
          source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
          style={{ width: 45, height: 45, borderRadius: 100 }}
        />
        <View>
          <Text style={styles.name}>Name</Text>
          <Text style={styles.status}>Online</Text>
        </View>

      </View>

      <View style={styles.actions}>
        <VoiceCall />
        <VideoCall />
      </View>

    </View>


  );
};

const styles = StyleSheet.create({
  name: {
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: '#000000',
  },
  status: {
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: 'rgba(0, 0, 0, 0.35)',
  },
  container: {
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
  actions:{
    flexDirection: 'row',
    width: '19%',
    height: '70%',

    justifyContent: 'space-between',
    alignItems: 'center',
  }
})

export default Chat;