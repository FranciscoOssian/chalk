import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, ScrollView, TouchableOpacity } from 'react-native'

import auth from '@react-native-firebase/auth'
import useAuth from '../../../Hooks/Firebase/useAuth'

import getRealm from '../../../services/realm'

import firestore from '@react-native-firebase/firestore';

const SignUp = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')

  const userAuth = useAuth()

  useEffect(() => {
    const run = async () => {
      const realm = await getRealm()
      const myUser = realm.objects("myUser")[0]
      if (userAuth?.user && myUser) navigation.navigate('Home')
    }
    run()
  }, [userAuth])

  const testPassword = () => {
    if (password === '' && secondPassword === '') return false
    return password === secondPassword
  }

  const saveUser = async (user) => {
    const realm = await getRealm()
    realm.write(() => {
      realm.create('myUser', user)
    })
  }

  const onHandleSignUp = async (email, password) => {
    try{
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)
      navigation.navigate('Home')
      const data = {
        name: 'Anon',
        age: 18,
        email: email,
        id: userCredential.user.uid,
        bio: '',
        profilePicture: ''
      }
      await saveUser(data)
      await firestore().collection('Users').doc(userCredential.user.uid).set(data)
    }
    catch(e){
      console.log(e)
    }

  }

  return (
    <ScrollView style={styles.scrollView}>

      <Text style={styles.PageName}>SignUp</Text>

      <View style={styles.form}>

        <TextInput
          placeholder="Email"
          value={email}
          style={styles.input}
          onChangeText={(txt) => setEmail(txt)}
          keyboardType='email-address'
        />
        <TextInput
          placeholder="Password"
          value={password}
          style={styles.input}
          onChangeText={(txt) => setPassword(txt)}
        />
        <TextInput
          placeholder="Repeat your password"
          value={secondPassword}
          style={styles.input}
          onChangeText={(txt) => setSecondPassword(txt)}
        />

        <TextInput
        />

        <TouchableOpacity
          style={styles.RectButton}
          onPress={() => { if (testPassword()) onHandleSignUp(email, password) }}
        >
          <View style={styles.button}>
            <Text style={{ color: 'white' }}>SignUp</Text>
          </View>
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('SignIn')}>Already have a account? Login, click here</Text>
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
    marginTop: 150
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
  },
  scrollView: {
  },
})



export default SignUp;