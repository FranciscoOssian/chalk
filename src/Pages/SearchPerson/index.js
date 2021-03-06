import React, { useEffect, useState } from 'react';
import { Text, ImageBackground, StyleSheet, Image, View, Alert, } from 'react-native'

import appConfig from '../../../app.json'

import { io } from "socket.io-client"
import firestore from '@react-native-firebase/firestore';

import StopSearch from '../../../assests/images/pages/SearchPerson/Stop'

import { useLocalUser } from '../../Hooks/localDatabase/user'

import Core from '../../services/core'

const core = new Core()


const SearchPeron = ({ navigation }) => {
  
  const { user: me } = useLocalUser()
  const [authError, setAuthError] = useState(false)

  const onHandlePersonFind = async (userMatched) => {
    const chatName = [me.id, userMatched.user.id].sort().join('-')
    const friendInDb = await core.localDB.get.user(userMatched.user.id)
    if (!friendInDb) {
      const user = await core.cloudStore.get.user(userMatched.user.id)
      core.localDB.create.user({
        ...user,
        age: parseInt(user.age),
        id: userMatched.user.id
      })
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
    else navigation.push('Chat', { friendID: friendInDb.id, chatName })
  }
  
  useEffect(() => {

    console.log( core.cloudAuth.auth().currentUser )

    if( core.cloudAuth.auth().currentUser.phoneNumber === null ){
      setAuthError(!authError)
      Alert.alert('Verify your phone number', 'Please you need to verify your phone number to match a user. For community safety.')
      return
    }

    const socket = io(appConfig.match_url);
    socket.on('connect', () => {
      console.log('your id is', socket.id)
      
      socket.on("match", onHandlePersonFind)

      socket.emit('add_user', {
        id: me.id
      })
    })

  }, [])

  return (
    <ImageBackground
      source={{ uri: me.profilePicture }}
      style={styles.image}
      blurRadius={5}
      opacity={0.8}
    >

      <Text onPress={
        () => Alert.alert('')
      } style={[styles.subTitle, { textDecorationLine: 'underline' }]}
      >
        How works the matching?
      </Text>


      <View style={styles.container}>
        <Image
          source={{ uri: me.profilePicture }}
          style={styles.perfilImage}
        />

        <Text style={styles.Title}>{me.name}, we are search a connection for you. Please wait.</Text>

        {
          authError?
            <Text style={styles.subTitle}>Error, no phone verified</Text>
              :
            <Text style={styles.subTitle}>Contacting???</Text>
        }
      </View>


      <View><StopSearch onPress={() => { 
        navigation.navigate('Home')
       }} /></View>


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