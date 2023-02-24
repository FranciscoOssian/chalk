import SVG from './SVG';
import { Touch } from './styles';

const SendIcon = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default SendIcon;
