import { Touch, Button as Wrapper, Text } from './styles';

export const Button = (props) => {
  return (
    <Touch {...props}>
      <Wrapper>{props.children ? props.children : <Text>{props.title}</Text>}</Wrapper>
    </Touch>
  );
};

export default Button;
