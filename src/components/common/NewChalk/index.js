import SVG from './SVG';
import { Touch } from './styles';

const NewChalk = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default NewChalk;
