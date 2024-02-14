import { TextInput } from 'react-native';
import styled from 'styled-components/native';

import R from '../../../common/Row';
import theme from '@src/styles/theme';

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

  flex-direction: row;

  padding: 10px;
  height: auto;
  max-height: 300px;

  overflow: scroll;

  margin-right: 10px;
`;

export const Row = styled(R)`
  margin-bottom: 10px;

  width: 100%;

  padding: 10px;
`;

export const Container = styled.View`
  align-items: center;
  justify-content: center;

  background-color: ${theme.colors.primary};
  border-radius: 1000px;

  width: 50px;
  height: 50px;
`;
