import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={27}
      height={18}
      fill="none"
      {...props}
    >
      <Path
        fill="#000"
        d="M15.2 0C17.299 0 19 1.727 19 3.857v10.286C19 16.273 17.299 18 15.2 18H3.8C1.701 18 0 16.273 0 14.143V3.857C0 1.727 1.701 0 3.8 0h11.4zm11.666 4.022c.088.151.134.32.134.493v8.97c0 .56-.478 1.015-1.067 1.015a1.11 1.11 0 01-.518-.128l-3.73-1.972A1.26 1.26 0 0121 11.291V6.71c0-.46.262-.885.686-1.11l3.73-1.971c.514-.272 1.164-.096 1.45.394z"
      />
    </Svg>
  )
}

export default SvgComponent