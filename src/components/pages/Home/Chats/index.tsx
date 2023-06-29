import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';

import Chat from '../Chat';
import { Chats as Wrapper } from './styles';
import UserType from '@src/types/user';
import ChatType from '@src/types/chat';

interface ChatsPropsType {
  list: Realm.Results<ChatType> | ChatType[]
  me?: UserType
  callbackToFetchAndSave?: (id: string) => void
}

interface handleViewableItemsChangedType {
  viewableItems: Array<{ item: ChatType, key: string, index: number | null, isViewable: boolean, section?: any }>;
  changed: Array<{ item: ChatType, key: string, index: number | null, isViewable: boolean, section?: any }>;
}

const loadedItems = new Set();

const Chats = ({ list, me, callbackToFetchAndSave }: ChatsPropsType) => {
  const nav = useNavigation();

  const onView = useCallback(({ viewableItems }: handleViewableItemsChangedType) => {
    viewableItems.forEach((i) => {
      if(!loadedItems.has(i.item.id)){
        //fetch
        const friendId = i.item.id.split('-').find(i => i!==me?.id)
        if(!friendId) return
        if(callbackToFetchAndSave)
          callbackToFetchAndSave(friendId)
      }
      loadedItems.add(i.item.id);
    });
  }, []);

  const renderItem = ({ item: c, index: i }: any) => {
    let friend: UserType;
    if (c.owners[0].id === me?.id) friend = c.owners[1];
    else friend = c.owners[0];

    return (
      <Chat
        key={i}
        yourUID={me?.id || ''}
        name={friend?.name}
        pic={friend.profilePicture}
        lastMessage={c.lastMessage}
        onPicturePress={() => {
          nav.navigate('/image' as never, { list: [friend.profilePicture] } as never);
        }}
        onChatPress={() => {
          nav.navigate('/chat' as never, { id: friend.id } as never);
        }}
      />
    );
  };

  return (
    <Wrapper>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, _) => item.id}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onView}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50 // Altere este valor conforme necessário
        }}
      />
    </Wrapper>
  );
};

export default Chats;
