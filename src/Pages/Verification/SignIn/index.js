import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TextInput, ScrollView, Button, TouchableOpacity, Alert } from 'react-native'

import Core from '../../../services/core'

import { useLocalUser } from '../../../Hooks/localDatabase/user'

const core = new Core()

const SignIn = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { update, user } = useLocalUser()

  useEffect(() => {
    const run  = async () => {
      if (user) navigation.navigate('Home')
    }
    run()
  }, [user])

  const onHandleSignIn = async (email, password) => {
    setEmail('')
    setPassword('')
    const resp = await core.signIn(email, password)
    if(resp.error){
      console.log(resp.error)
      Alert.alert(resp.error.code, resp.error.message)
      return
    }
    update( await core.localDB.get.myUser() )
    navigation.navigate('Home')
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