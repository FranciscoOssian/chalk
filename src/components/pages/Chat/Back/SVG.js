import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg width={13} height={23} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      d="M12.183 2.56A1.5 1.5 0 1 0 10.062.44L.439 10.061a1.5 1.5 0 0 0 0 2.121l9.623 9.622a1.5 1.5 0 1 0 2.121-2.12l-8.562-8.563 8.562-8.561Z"
      fill="#000"
    />
  </Svg>
);

export default SvgComponent;
