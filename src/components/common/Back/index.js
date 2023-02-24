import SVG from './SVG';
import { Touch } from './styles';

const Back = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default Back;
