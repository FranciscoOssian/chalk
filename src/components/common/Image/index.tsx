import { defaultFirebaseProfilePicture } from '@src/utils/consts';
import { Image, Touch } from './styles';

interface PropTypes{
  uri?: string
  onPress?: () => void
  width: number | string
  square?: boolean
}

export default ({ uri, onPress, width, square }: PropTypes) => {
  return (
    <Touch onPress={onPress} width={width} square={square} activeOpacity={1}>
      <Image
        source={{ uri: uri || defaultFirebaseProfilePicture }}
      />
    </Touch>
  );
};
