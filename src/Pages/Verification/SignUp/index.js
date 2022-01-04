import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, ScrollView, TouchableOpacity } from 'react-native'

import { useLocalUser } from '../../../Hooks/localDatabase/user'

import Core from '../../../services/core'
const core  = new Core();

const SignUp = ({ navigation }) => {

  const { user, update } = useLocalUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')

  useEffect(() => {
    const run  = async () => {
      if (user) navigation.navigate('Home')
    }
    run()
  }, [user])

  const testPassword = () => {
    if (password === '' && secondPassword === '') return false
    return password === secondPassword
  }

  const onHandleSignUp = async (email, password) => {
    setEmail('')
    setPassword('')
    setSecondPassword('')
    await core.signUp(email, password)
    update( await core.localDB.get.myUser() )
    navigation.navigate('Home')
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