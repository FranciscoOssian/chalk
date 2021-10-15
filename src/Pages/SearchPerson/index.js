import React, { useEffect } from 'react';
import { Text, ImageBackground, StyleSheet, Image, View } from 'react-native'

import { io } from "socket.io-client"
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import getRealm from '../../services/realm';

import StopSearch from '../../../assests/images/pages/SearchPerson/Stop'


const SearchPeron = ({ navigation }) => {
  
  useEffect(() => {
    const socket = io("https://chatalk-matching-system.herokuapp.com/");
    socket.on('connect', () => {
      console.log('your id is', socket.id)

      socket.on("match", async userMatched => {
        
        const realm = await getRealm()
        const users = realm.objects('User')

        const chatName = [auth().currentUser.uid, userMatched.user.id].sort().join('-')

        const friendInDb = users.filtered(`id == '${userMatched.user.id}'`)[0]

        if( !friendInDb ){
          
          const userSnapshot = await firestore().collection('Users').doc(userMatched.user.id).get();
          const user = userSnapshot.data()
          
          realm.write( async () => {
            
            realm.create('User', {
              ...user,
              age: parseInt(user.age)
            } )

            const me = users.filtered(`id == '${auth().currentUser.uid}'`)[0]
            const friend = users.filtered(`id == '${user.id}'`)[0]
            
            realm.create('Chat', {
              id: chatName,
              owners: [ me, friend ],
              messages: []
            })

            const snapshot = await firestore().collection('Users').doc(`${me.id}`).collection('friends').doc('friends').get()
            const friends = snapshot.data()?.friends

            if( friends.indexOf(friend.id) === -1 ){
              await firestore().collection('Users').doc(`${me.id}`).collection('friends').doc('friends').update({
                friends: friends.push(friend.id)
              })
            }

            navigation.navigate('Chat', { friendID: user.id, chatName})
  
          })
        }
        else{
          const chat = realm.objects('Chat').filtered(`id == '${chatName}'`)[0]
          navigation.navigate('Chat', { friendID: friendInDb.id, chatName})
        }
      })

      socket.emit('add_user', {
        id: auth().currentUser.uid
      })
    })
  }, [])

  return (
    <ImageBackground
      source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
      style={styles.image}
      blurRadius={15}
      opacity={0.8}
    >

      <Text onPress={() => navigation.navigate('Chat')} style={[styles.subTitle, { textDecorationLine: 'underline' }]}>How works the matching?</Text>


      <View style={styles.container}>
        <Image
          source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
          style={styles.perfilImage}
        />

        <Text style={styles.Title}>Martha, we are search a connection for you. Please wait.</Text>

        <Text style={styles.subTitle}>Contacting…</Text>
      </View>


      <View><StopSearch onPress={() => { }} /></View>


    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  perfilImage: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  subTitle: {
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.33,

    color: 'rgba(255, 255, 255, 0.6)'
  },
  Title: {
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 31,
    textAlign: 'center',

    color: '#FFFFFF'
  },
  container: {
    alignItems: 'center'
  }
})

export default SearchPeron;