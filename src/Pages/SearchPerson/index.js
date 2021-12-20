import React, { useEffect } from 'react';
import { Text, ImageBackground, StyleSheet, Image, View } from 'react-native'

import { io } from "socket.io-client"
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import StopSearch from '../../../assests/images/pages/SearchPerson/Stop'

import { useLocalUser } from '../../Hooks/localDatabase/user'

import Core from '../../services/core'

const core = new Core()


const SearchPeron = ({ navigation }) => {

  const { user: me } = useLocalUser()

  useEffect(() => {
    const socket = io("https://chatalk-matching-system.herokuapp.com/");
    socket.on('connect', () => {
      console.log('your id is', socket.id)

      socket.on("match", async userMatched => {

        const chatName = [me.id, userMatched.user.id].sort().join('-')

        console.log(userMatched)

        const friendInDb = await core.localDB.get.user(userMatched.user.id)

        console.log(friendInDb)

        if (!friendInDb) {

          const userSnapshot = await firestore().collection('Users').doc(userMatched.user.id).get();
          const user = userSnapshot.data()

          console.log(user)

          core.localDB.create.user({
            ...user,
            age: parseInt(user.age),
            id: userMatched.user.id
          })

          console.log( await core.localDB.get.user( userMatched.user.id ) )

          core.localDB.create.chat({
            id: chatName,
            owners: [me, await core.localDB.get.user(userMatched.user.id)],
            messages: []
          })

          let friends = []
          let friendsSnapShot = await firestore().collection('Users').doc(`${me.id}`).collection('friends').doc('friends').get()
          if (!friendsSnapShot.exists) {
            friends = [userMatched.user.id]
            await firestore().collection('Users').doc(me.id).collection(`friends`).doc(`friends`).set({
              friends
            })
          }
          else friends = friendsSnapShot.data().friends

          if (friends.indexOf(userMatched.user.id) === -1) {
            await firestore().collection('Users').doc(`${me.id}`).collection('friends').doc('friends').update({
              friends: [...friends, userMatched.user.id]
            })
          }

          navigation.push('Chat', { friendID: userMatched.user.id, chatName })

        }
        else {
          navigation.push('Chat', { friendID: friendInDb.id, chatName })
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