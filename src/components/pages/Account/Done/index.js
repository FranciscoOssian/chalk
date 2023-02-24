import { MaterialIcons } from '@expo/vector-icons';

import { Touch } from './styles';

const Done = (p) => {
  return (
    <Touch onPress={p.onPress}>
      <MaterialIcons name="done" size={40} color="black" />
    </Touch>
  );
};

export default Done;
