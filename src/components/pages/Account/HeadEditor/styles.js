import styled from 'styled-components';

import { Bio as B } from '../../../common/Bio';
import Pic from '../../../common/Image';

export const Head = styled.View`
  width: 100%;
  height: auto;
  padding: 10px 0 10px 0;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

export const Profile = styled(Pic)``;

export const ProfileBorder = styled.View`
  margin: 5px;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const Column = styled.View`
  flex-direction: column;
`;

export const Bio = styled(B)`
  margin: 0;
  padding-left: 20px;
  text-align: left;
`;
