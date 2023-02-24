import styled from 'styled-components';

import T from '../Touch';

export const Image = styled.Image`
  width: 100%;
  aspect-ratio: 1;
`;

export const Touch = styled(T)`
  width: ${(p) => (typeof p.width === 'number' ? `${p.width}px` : p.width)};
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;

  border-radius: 10000000000px;
  overflow: ${(p) => (p.square ? 'visible' : 'hidden')};
`;
