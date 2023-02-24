import { Wrapper, Title, Container } from './styles';

const Block = ({ children, title, hidden }) => {
  return hidden ? null : (
    <Container>
      <Title>{title}</Title>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
};

export default Block;
