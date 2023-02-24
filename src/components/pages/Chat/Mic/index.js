import SVG from './SVG';
import { Touch } from './styles';

const Mic = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default Mic;
