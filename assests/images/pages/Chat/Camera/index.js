import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={22}
      fill="none"
      {...props}
    >
      <Path
        fill="#0584FE"
        d="M14.623 0c.644 0 1.265.242 1.739.676l1.651 1.517c.415.38.942.613 1.5.665l.24.012h.76C22.99 2.87 25 4.868 25 7.333v10.203C25 20.001 22.991 22 20.513 22H4.487C2.01 22 0 20.002 0 17.536V7.333C0 4.868 2.009 2.87 4.487 2.87h.76c.645 0 1.266-.242 1.74-.677L8.638.676A2.572 2.572 0 0110.378 0h4.245zM12.5 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 2a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"
      />
    </Svg>
  )
}

export default SvgComponent
