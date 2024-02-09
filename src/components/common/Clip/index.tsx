import { AntDesign } from '@expo/vector-icons';
import { Touch } from './styles';
import theme from '@src/styles/theme';

const Clip = ({ onPress }: { onPress: () => Promise<void> }) => {
  return (
    <Touch onPress={onPress}>
      <AntDesign name="paperclip" size={24} color={theme.colors.primary} />
    </Touch>
  );
};

export default Clip;
