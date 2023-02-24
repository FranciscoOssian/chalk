import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Age } from '../../../common/Age';
import Back from '../../../common/Back';
import { Name } from '../../../common/Name';
import Done from '../Done';
import { Head as Wrapper, Profile, ProfileBorder, Bio } from './styles';

const pic =
  'https://avatars.githubusercontent.com/u/42554801?s=400&u=7dcb4767a67db8b816f6f00b9f1952efffbfe234&v=4';

const Pic = (props) => (
  <ProfileBorder>
    <Profile {...props} />
  </ProfileBorder>
);

const pickeImage = async () =>
  await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
    aspect: [1, 1],
  });

const HeadEditor = ({ onBackPress, onDonePress, onProfilePhotoPick, profile }) => {
  const onHandlePickImage = async () => {
    Alert.alert('future update will have image editing');
    //return;
    /*
    const result = await pickeImage();
    if (result.canceled) return;
    onProfilePhotoPick(result.assets[0].uri);
    */
  };

  return (
    <View>
      <Back onPress={onBackPress} />
      <Done onPress={onDonePress} />
      <Wrapper>
        <Pic uri={profile.pic} width="40%" onPress={onHandlePickImage} />
        <Name>{profile.name}</Name>
        <Age>{profile.age}</Age>
        <ScrollView style={{ width: '100%' }}>
          <Bio>{profile.bio}</Bio>
        </ScrollView>
      </Wrapper>
    </View>
  );
};

export default HeadEditor;
