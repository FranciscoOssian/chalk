import { Picker } from '@react-native-picker/picker';
import styled from 'styled-components';

import BaseInput from '../../../common/BaseInput';

export const Input = styled(BaseInput)`
  height: ${(p) => (p.height ? `${p.height}px` : '36px')};
  background-color: #dedede;

  padding: 10px 10px 10px 20px;
  margin: 10px;
`;

export const Form = styled.View`
  width: 100%;
  padding: 0px 7.5% 0 7.5%;
  background-color: ${(p) => p.theme.colors.background};
  margin-bottom: 100px;
`;

export const InputPicker = styled(Picker)``;

export const PickerContainer = styled.View`
  height: 0px;
`;
