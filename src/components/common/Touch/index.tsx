import { Touch as T } from './styles';

interface PropsType {
  onPress: () => void
  children: any
}

const Touch = ({ onPress, children, ...rest }: PropsType) => {
  return (
    <T onPress={() => (onPress ? onPress() : null)} {...rest}>
      {children}
    </T>
  );
};

export default Touch;
