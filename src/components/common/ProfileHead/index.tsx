import React from 'react';

import Row from '../../common/Row';
import { Age } from '../Age';
import Back from '../Back';
import { Bio } from '../Bio';
import ProfilePicture from '../Image';
import { Name } from '../Name';
import Verified from '../Verified';
import { Head as Wrapper } from './styles';

import UserType from '@src/types/user';

interface PropTypes {
  onProfilePress: () => void;
  onBackPress: () => void;
  user: UserType;
}

/**
 * Component for rendering the header section of a user profile.
 * @param {Function} props.onProfilePress - The callback function called when the profile picture is pressed.
 * @param {Function} props.onBackPress - The callback function called when the back button is pressed.
 * @param {UserType} props.user - The user data.
 * @returns {JSX.Element} The header component.
 * @typedef {import('@src/types/user').default} UserType - The user type.
 */
const Head = ({ onProfilePress, onBackPress, user }: PropTypes) => {
  return (
    <Wrapper>
      <Back onPress={onBackPress} />
      <ProfilePicture width={100} uri={user.profilePicture} onPress={() => onProfilePress()} />
      <Row>
        <Name>{user.name}</Name>
        {user.authenticated ? <Verified /> : null}
        <Age>{user.age}y</Age>
      </Row>
      <Bio>bio:{user.bio}</Bio>
    </Wrapper>
  );
};

export default Head;
