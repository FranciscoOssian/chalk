import * as React from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native'

const Story = ({ online, picture, name }) => {
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

export default Story

const StoryStyle = StyleSheet.create({
  Image: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  onLine: {
    backgroundColor: '#5AD439',
    borderWidth: 3,
    borderRadius: 100,
    borderColor: '#ffffff',
    width: 20,
    height: 20,

    zIndex: 2,
    bottom: 0,
    right: 0,

    position: 'absolute'
  },
  name: {
    color: 'rgba(0, 0, 0, 0.35)',
    fontFamily: 'Assistant',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    letterSpacing: -0.08,

    width: 50,
  },
  container: {
    marginBottom: 30,
    marginHorizontal: 20,
  }
})
