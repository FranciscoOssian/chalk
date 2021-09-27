import * as React from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native'

const StoryBubble = ({ online, picture, name }) => {
  return (
    <View style={StoryStyle.container}>
      <View>
        <Image
          style={StoryStyle.Image}
          source={{ uri: picture }}
        />
        {online ? <View style={StoryStyle.onLine}></View> : <></>}
      </View>
      <Text style={StoryStyle.name}>{name}</Text>
    </View>
  )
}

const StoryStyle = StyleSheet.create({
  Image: {
    width: 52,
    height: 52,
    borderRadius: 100,
    position: 'absolute'
  },
  onLine: {
    backgroundColor: '#5AD439',
    borderWidth: 3,
    borderRadius: 100,
    borderColor: '#ffffff',
    width: 15,
    height: 15,
    top: 35,
    left: 35
  },
  name: {
    top: 30,
    color: 'rgba(0, 0, 0, 0.35)',
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: -0.08,

    width: 50,

    marginTop: 7
  },
  container: {
    marginBottom: 30,
    marginHorizontal: 20
  }
})

const Home = () => {
  return (
    <ScrollView>
      <View style={styles.Head}>
        <Image
          style={styles.Perfil}
          source={{ uri: "https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg" }}
        />
        <Text style={styles.HeadText}>Chats</Text>
      </View>

      <ScrollView
        horizontal
        style={{marginTop: 7}}
      >
        <StoryBubble picture='https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' online name="nome" />
        <StoryBubble picture='https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg' online name="nome" />
      </ScrollView>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  Perfil: {
    width: 40,
    height: 40,
    borderRadius: 100,
    margin: 16
  },
  Head: {
    flexDirection: "row",
    alignItems: "center"
  },
  HeadText: {
    letterSpacing: 0.4,
    lineHeight: 38,

    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: "Assistant",
    fontStyle: 'normal'
  }
});

export default Home;