import { AntDesign } from '@expo/vector-icons';
import { Touch } from './styles';

const Close = ({ onPress, size }: { onPress: () => Promise<void>; size: number }) => {
  return (
    <Touch onPress={onPress}>
      <AntDesign name="closecircle" size={size} color="red" />
    </Touch>
  );
};

export default Close;
