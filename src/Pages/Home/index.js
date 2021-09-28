import * as React from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native'

import SearchSvgComponent from '../../../assests/images/pages/Home/Search'

import Story from './Components/Story'
import Chat from './Components/Chat'

const storys = []

for (let i = 0; i < 50; ++i) {
  storys.push({ id: i, picture: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg', online: true, name: 'name' })
}

const chats = []

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

for (let i = 0; i < 70; ++i) {
  chats.push(
    {
      id: i,
      picture: 'https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg',
      name: `nameP${i}`,
      lastMessage: {
        content: `👍👍👍👍👍👍👍👍👍hkoooolklk👍👍👍kk ${parseInt(Math.random() * 100)} oi`,
        timestamp: randomDate(new Date(2012, 0, 1), new Date()),
        view: true,
        senderUID: 'ddd'
      }
    }
  )
}

const Home = () => {
  return (
    <View>
      <View style={styles.Head}>
        <Image
          style={styles.Perfil}
          source={{ uri: "https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg" }}
        />
        <Text style={styles.HeadText}>Chats</Text>
      </View>
      <ScrollView style={{height: '70%'}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 7 }}
        >
          <Story picture="https://casa.abril.com.br/wp-content/uploads/2020/06/img-7587.jpg" online={false} name="Your Story" />
          {
            storys.map(story => <Story key={story.id} picture={story.picture} online={story.online} name={story.name} />)
          }
        </ScrollView>


        {
          chats.map(
            chat =>
              <Chat
                yourUID='ddd'
                key={chat.id}
                picture={chat.picture}
                name={chat.name}
                lastMessage={chat.lastMessage}
              />
          )
        }
      </ScrollView>

      <View style={{ height: 76, width: '100%', backgroundColor: 'blue' }}>
        <Text>AdSense place</Text>
      </View>

      <View style={{ height: 76, width: '100%', alignItems: 'center' }}>
        <SearchSvgComponent
          primaryColor="#0584FE"
          secondaryColor="rgb(255,255,255)"
        />
      </View>

    </View>
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