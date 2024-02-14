import SVG from './SVG';
import { Touch } from './styles';

const Camera = ({ onPress }: { onPress?: () => void }) => {
  return onPress ? (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  ) : (
    <SVG />
  );
};

export default Camera;
