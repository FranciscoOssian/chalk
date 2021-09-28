import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={23}
      fill="none"
      {...props}
    >
      <Path
        fill="#0584FE"
        d="M12.183 2.56A1.5 1.5 0 1010.062.44L.439 10.061a1.5 1.5 0 000 2.121l9.623 9.622a1.5 1.5 0 102.121-2.12l-8.562-8.563 8.562-8.561z"
      />
    </Svg>
  )
}

export default SvgComponent
