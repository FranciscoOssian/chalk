import { TextInput } from 'react-native';
import styled from 'styled-components/native';

import R from '../../../common/Row';

export const Input = styled(TextInput)`
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.65px;

  color: #999999;

  width: 88%;
`;

export const Wrapper = styled.View`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 18px;

  width: 70%;

  flex-direction: row;

  padding: 10px;
  height: auto;
  max-height: 300px;

  overflow: scroll;

  margin-right: 10px;
`;

export const Row = styled(R)`
  align-items: center;
  margin: 0 0 10px 0;
`;

export const Container = styled(R)`
  width: 90px;
  align-items: center;
  justify-content: center;
`;

export const ContainerLeft = styled(R)`
  margin: 0 10px 0 5px;
`;

export const ContainerRight = styled(R)`
  margin: 0 5px 0 10px;
`;
