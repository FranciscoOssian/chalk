import { AntDesign } from '@expo/vector-icons';

import Touch from '../Touch';

const Apple = (props) => {
  return (
    <Touch {...props}>
      <AntDesign name="apple1" {...props} />
    </Touch>
  );
};

export default Apple;
