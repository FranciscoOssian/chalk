import { MaterialIcons } from '@expo/vector-icons';

import { Touch } from './styles';

interface PropType {
  onPress: () => void
}

const Done = (p: PropType) => {
  return (
    <Touch onPress={p.onPress}>
      <MaterialIcons name="done" size={40} color="black" />
    </Touch>
  );
};

export default Done;
