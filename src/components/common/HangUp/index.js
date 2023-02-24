import SVG from './SVG';
import { Touch } from './styles';

const HangUp = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default HangUp;
