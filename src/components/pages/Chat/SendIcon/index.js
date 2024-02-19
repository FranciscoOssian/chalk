import { Ionicons } from '@expo/vector-icons';
import { Touch } from './styles';
import theme from '@src/styles/theme';

const SendIcon = ({ onPress }) => {
  return (
    <Touch onPress={onPress}>
      <Ionicons name="send-sharp" size={30} color={theme.colors.background} />
    </Touch>
  );
};

export default SendIcon;
