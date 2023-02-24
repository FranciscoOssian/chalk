import { Touch as T } from './styles';

const Touch = ({ onPress, children, ...rest }) => {
  return (
    <T onPress={() => (onPress ? onPress() : null)} {...rest}>
      {children}
    </T>
  );
};

export default Touch;
