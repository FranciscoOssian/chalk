import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={19}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        fill="#0584FE"
        d="M5 22h8a1 1 0 01.116 1.993l-.117.007H5a1 1 0 01-.116-1.993L4.999 22h8-8zm12.1-11.396a1 1 0 01.97 1.028c-.041 1.433-.5 2.95-1.276 4.296A9 9 0 010 11.626a1 1 0 012-.046 7 7 0 0013.062 3.348c.616-1.068.978-2.265 1.01-3.354a1 1 0 011.029-.97zM9 0a5 5 0 015 5v6.5a5 5 0 11-10 0V5a5 5 0 015-5z"
      />
    </Svg>
  )
}

export default SvgComponent