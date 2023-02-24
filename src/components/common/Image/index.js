import { Image, Touch } from './styles';

export default ({ uri, onPress, width, square }) => {
  return (
    <Touch onPress={onPress} width={width} square={square} activeOpacity={1}>
      <Image source={{ uri }} width={width} />
    </Touch>
  );
};
