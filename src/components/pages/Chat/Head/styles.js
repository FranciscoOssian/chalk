import styled from 'styled-components';

import Touch from '../../../common/Touch';

export const HeadWrapper = styled.View`
  flex-direction: row;

  width: 100%;

  justify-content: space-between;
  align-items: center;

  height: 75px;
`;

export const Container = styled.View``;

export const Name = styled.Text`
  //font-family: 'Assistant';
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.41px;

  color: #000000;
`;

export const Status = styled.Text`
  //font-family: 'Assistant';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 18px;
  /* identical to box height, or 138% */

  letter-spacing: -0.08px;

  color: rgba(0, 0, 0, 0.35);
`;

export const PerfilInfo = styled(Touch)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 150px;
  margin-left: 20px;
`;

export const Icons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 70px;
  margin-right: 20px;
`;
