import styled from 'styled-components/native';

import Touch from '../Touch';

export const Button = styled(Touch)`
  width: 100%;
  height: 52px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  margin-top: 3px;
  margin-bottom: 3px;
`;

export const Title = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.41px;

  color: #000000;
`;
