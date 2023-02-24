import SVG from './SVG';
import { Touch } from './styles';

const PhoneCall = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <SVG />
    </Touch>
  );
};

export default PhoneCall;
