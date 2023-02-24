import { Entypo } from '@expo/vector-icons';

import Touch from '../Touch';

const FaceBook = (props) => {
  return (
    <Touch {...props}>
      <Entypo name="facebook-with-circle" {...props} />
    </Touch>
  );
};

export default FaceBook;
