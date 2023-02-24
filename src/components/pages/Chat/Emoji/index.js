import SVG from './SVG';
import { Touch } from './styles';

const Emoji = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default Emoji;
