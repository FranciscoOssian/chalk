import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Modal = styled.View`
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
  z-index: +20;

  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 1;
`;
