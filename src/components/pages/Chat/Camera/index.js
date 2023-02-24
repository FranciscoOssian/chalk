import SVG from './SVG';
import { Touch } from './styles';

const Camera = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default Camera;
