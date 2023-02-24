import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={8}
      height={14}
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 11.912l1.414 1.414 6.413-6.413L1.414.5 0 1.914l4.999 5L0 11.911z"
        fill="#000"
        fillOpacity={0.2}
      />
    </Svg>
  );
}

export default SvgComponent;
