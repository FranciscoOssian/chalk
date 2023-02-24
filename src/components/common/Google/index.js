import { AntDesign } from '@expo/vector-icons';

import Touch from '../Touch';

const Google = (props) => {
  return (
    <Touch {...props}>
      <AntDesign name="google" {...props} />
    </Touch>
  );
};

export default Google;
