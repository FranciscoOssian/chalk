import React from 'react';
import { Text, ImageBackground, StyleSheet, Image, View } from 'react-native'

import StopSearch from '../../../assests/images/pages/SearchPerson/Stop'

const SearchPeron = ({ navigation }) => {

  return (
    <ImageBackground
      source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
      style={styles.image}
      blurRadius={15}
      opacity={0.8}
    >

      <Text onPress={ () => navigation.navigate('Chat') } style={[styles.subTitle, { textDecorationLine: 'underline' }]}>How works the matching?</Text>


      <View style={styles.container}>
        <Image
          source={{ uri: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' }}
          style={styles.perfilImage}
        />

        <Text style={styles.Title}>Martha, we are search a connection for you. Please wait.</Text>

        <Text style={styles.subTitle}>Contacting…</Text>
      </View>


    <View><StopSearch onPress={ () => {} } /></View>
      

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
  container:{
    alignItems: 'center'
  }
})

export default SearchPeron;