import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        fill="#000"
        d="M9.878 13.992l.13.13c2.238 2.166 4.11 3.184 5.618 3.052l.435-.405c.617-.563 1.083-.919 1.397-1.07.654-.313 1.113-.307 2.351.364a14.52 14.52 0 013.33 2.481c.534.534.368 1.454.18 1.862l-.123.227c-.334.58-1.544 2.492-3.863 2.82-.88.123-1.993.01-3.297-.383-2.794-.968-5.576-2.74-8.347-5.319l-.492-.468-.005.005-.238-.242-.242-.238.005-.005-.468-.492C3.67 13.54 1.898 10.758.93 7.964.538 6.66.424 5.548.548 4.667.898 2.184 3.066.972 3.468.747L3.51.724C3.858.522 4.88.286 5.456.86l.272.28a14.549 14.549 0 012.21 3.05c.67 1.238.676 1.697.363 2.35-.184.384-.676.995-1.475 1.833-.132 1.508.886 3.38 3.052 5.618z"
      />
    </Svg>
  )
}

export default SvgComponent
