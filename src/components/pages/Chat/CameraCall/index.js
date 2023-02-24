import SVG from './SVG';
import { Touch } from './styles';

const CameraCall = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default CameraCall;
