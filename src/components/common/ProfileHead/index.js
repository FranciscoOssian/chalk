import React from 'react';

import Row from '../../common/Row';
import { Age } from '../Age';
import Back from '../Back';
import { Bio } from '../Bio';
import ProfilePicture from '../Image';
import { Name } from '../Name';
import Verified from '../Verified';
import { Head as Wrapper } from './styles';

const Head = ({ pic, onProfilePress, onBackPress, profile, isVerified }) => {
  return (
    <Wrapper>
      <Back onPress={onBackPress} />
      <ProfilePicture width={100} uri={pic} onPress={() => onProfilePress()} />
      <Row>
        <Name>{profile.name}</Name>
        {isVerified ? <Verified /> : null}
      </Row>
      <Age>{profile.age}</Age>
      <Bio>{profile.bio}</Bio>
    </Wrapper>
  );
};

export default Head;
