import React from 'react';
import { ScrollView, View } from 'react-native';

import { Age } from '@components/common/Age';
import Back from '@components/common/Back';
import { Name } from '@components/common/Name';
import Done from '../Done';
import { Head as Wrapper, Profile, ProfileBorder, Bio } from './styles';
import UserType from '@src/types/user';

const Pic = (props: any) => (
  <ProfileBorder>
    <Profile {...props} />
  </ProfileBorder>
);

interface HeadEditorPropsType {
  onBackPress: () => void
  onDonePress: () => void
  onProfilePhotoPick?: () => void
  profile?: UserType
}

const HeadEditor = ({ onBackPress, onDonePress, onProfilePhotoPick, profile }: HeadEditorPropsType) => {
  return (
    <View>
      <Wrapper>
        <Pic uri={profile?.profilePicture} width="40%" onPress={onProfilePhotoPick} />
        <Name>{profile?.name}</Name>
        <Age>{profile?.age}</Age>
        <ScrollView style={{ width: '100%' }}>
          <Bio>{profile?.bio}</Bio>
        </ScrollView>
      </Wrapper>
    </View>
  );
};

export default HeadEditor;
