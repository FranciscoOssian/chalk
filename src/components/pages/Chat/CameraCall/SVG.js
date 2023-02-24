import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.2 0C17.2987 0 19 1.7269 19 3.85714V14.1429C19 16.2731 17.2987 18 15.2 18H3.8C1.70132 18 0 16.2731 0 14.1429V3.85714C0 1.7269 1.70132 0 3.8 0H15.2ZM26.8658 4.02231C26.9538 4.17312 27 4.34278 27 4.5153V13.4849C27 14.0455 26.5224 14.5 25.9333 14.5C25.7521 14.5 25.5738 14.456 25.4153 14.3723L21.6858 12.4005C21.2625 12.1767 21 11.7521 21 11.2912V6.70894C21 6.24812 21.2625 5.82352 21.6858 5.59973L25.4153 3.62793C25.9303 3.35566 26.5797 3.53224 26.8658 4.02231Z"
      fill="black"
      fill-opacity="0.5"
    />
  </Svg>
);

export default SvgComponent;
