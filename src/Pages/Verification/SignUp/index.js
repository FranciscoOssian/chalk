import * as React from 'react';
import { Text, StyleSheet, View, TextInput, ScrollView } from 'react-native'
import { RectButton } from 'react-native-gesture-handler';

const SignUp = ({ navigation }) => {
  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.PageName}>SignUp</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={()=>{}}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={()=>{}}
        />
        <TextInput
          placeholder="Repeat your password"
          style={styles.input}
          onChangeText={()=>{}}
        />

        <RectButton style={styles.RectButton}>
          <View style={styles.button}>
            <Text style={{color: 'white'}}>SignUp</Text>
          </View>
        </RectButton>

        <Text onPress={()=> navigation.navigate('SignIn') }>Already have a account? Login, click here</Text>
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
  button:{
    backgroundColor: '#0584FE',
    borderRadius: 18,
    width: 124,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RectButton:{
    marginBottom: 60
  },
  scrollView: {
  },
})



export default SignUp;