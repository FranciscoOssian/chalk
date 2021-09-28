import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SearchSvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={78}
      height={69}
      fill="none"
      {...props}
    >
      <Path fill="rgba(0,0,0,0)" d="M0 0h78v69H0z" />
      <Path
        fill={props.primaryColor}
        d="M40 58.843c13.807 0 25-10.71 25-23.922C65 21.71 53.807 11 40 11S15 21.71 15 34.922c0 3.558.917 7.298 2.751 11.219l.407.843a10.386 10.386 0 01.2 8.833c-1.16 2.622-1.358 4.252-.592 4.89.838.697 3.252.153 7.24-1.633l1.077-.494a10.43 10.43 0 016.597-.762l.552.133c2.205.595 4.46.892 6.768.892z"
      />
      <Path
        fill={props.secondaryColor}
        d="M38.63 34.868h-7.743v-2.499h7.742v-7.84h2.744v7.84h7.742v2.499h-7.742v7.889H38.63v-7.889z"
      />
    </Svg>
  )
}

export default SearchSvgComponent
