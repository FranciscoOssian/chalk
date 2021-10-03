import * as React from 'react';
import { Text, StyleSheet, View, TextInput, ScrollView, Button, TouchableOpacity } from 'react-native'

const SignIn = ({ navigation }) => {
  
  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.PageName}>SignIn</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={() => { }}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={() => { }}
        />

        <TouchableOpacity
          style={styles.RectButton}
          onPress={ () => navigation.navigate('Home') }
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