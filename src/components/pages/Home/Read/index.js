import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg
    width={16}
    height={16}
    fill={props.view ? 'green' : 'grey'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    {props.view ? (
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm2.419 3.04L6.686 8.771l-1.48-1.48-.094-.082a1 1 0 0 0-1.32 1.497l2.187 2.186.094.084a1 1 0 0 0 1.32-.084l4.44-4.44.083-.094a1 1 0 0 0-1.497-1.32Z"
      />
    ) : (
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z"
      />
    )}
  </Svg>
);

export default SvgComponent;
