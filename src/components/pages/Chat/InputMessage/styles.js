import { TextInput } from 'react-native';
import styled from 'styled-components';

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

  width: 80%;

  flex-direction: row;

  padding: 10px;
  height: auto;
  max-height: 300px;

  overflow: scroll;

  margin-right: 10px;
`;

export const Row = styled(R)`
  align-items: center;
  margin: 0 0 43px 0;
`;
