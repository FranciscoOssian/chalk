import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TextInput, ScrollView, Button, TouchableOpacity } from 'react-native'

import useAuth from '../../../Hooks/Firebase/useAuth'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

import getRealm from '../../../services/realm'

const SignIn = ({ navigation }) => {

  const userAuth = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const run  = async () => {
      if (userAuth?.user && userAuth.isSignedIn) navigation.navigate('Home')
    }
    run()
  }, [userAuth])

  const saveUser = async (user) => {
    const realm = await getRealm()
    realm.write( () => {
       realm.create('User', user)
    } )
  }

  const onHandleSignIn = async (email, password) => {
    try{
      const userCredentials = await auth().signInWithEmailAndPassword(email, password)
      const documentSnapshot = await firestore().collection('Users').doc(userCredentials.user.uid).get()
      const myData = documentSnapshot.data()
      console.log(myData)
      await saveUser(myData)
      console.log(myData)
    }catch(e){
      console.log('erorror',e)
    }
  }

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.PageName}>SignIn</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity
          style={styles.RectButton}
          onPress={() => onHandleSignIn(email, password)}
        >
          <View style={styles.button}>
            <Text style={{ color: 'white' }}>SignIn</Text>
          </View>
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('SignUp')}>Never SignUp? SignUp, click here.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  PageName: {
    fontFamily: 'Assistant-Bold',
    fontWeight: 'bold',
    fontSize: 49,
    width: '100%',
    textAlign: 'center',
    marginTop: 225
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 18,
    width: 267,
    height: 36,
    marginBottom: 32
  },
  form: {
    paddingTop: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0584FE',
    borderRadius: 18,
    width: 124,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RectButton: {
    marginBottom: 60
  }
})



export default SignIn;