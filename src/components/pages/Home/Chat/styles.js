import styled from 'styled-components';

import Touch from '../../../common/Touch';

export const Chat = styled(Touch)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px 10px 0px;
`;

export const ProfileImage = styled.Image`
  width: 20%;
  aspect-ratio: 1;
  border-radius: 100px;
`;

export const Name = styled.Text`
  //font-family: Assistant;
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 22px;

  letter-spacing: -0.4px;

  color: #000000;
`;

export const Message = styled.Text`
  //font-family: Assistant;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  letter-spacing: -0.15px;

  //color: rgba(0, 0, 0, 0.5);
  color: black;
`;

export const ContainerChat = styled.View`
  justify-content: center;
  padding-left: 2.5%;
  width: 70%;
  margin-left: 2.5%;
`;
