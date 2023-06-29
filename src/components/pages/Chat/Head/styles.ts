import styled from 'styled-components/native';

import Touch from '../../../common/Touch';

export const HeadWrapper = styled.View`
  flex-direction: row;

  width: 80%;

  align-items: center;

  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Container = styled.View`
  margin-left: 10px;
`;

export const Name = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.41px;

  color: #000000;
  width: 100%;
`;

export const Status = styled.Text`
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
  align-items: center;

  width: 100%;

  margin-left: 40px;
`;

export const Icons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 70px;
  margin-right: 20px;
`;
