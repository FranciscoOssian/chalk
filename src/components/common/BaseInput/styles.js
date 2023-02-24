import { TextInput } from 'react-native';
import styled from 'styled-components';

export const BaseInput = styled(TextInput)`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 18px;

  //font-family: 'Assistant';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.65px;

  color: ${(p) => p.theme.colors.textGreyBackground};
`;
