import ProfilePicture from '../../../common/Image';
import { Title, SubTitle, Wrapper } from './styles';

const Info = ({ name, picture }) => {
  return (
    <Wrapper>
      <ProfilePicture uri={picture} width={100} />
      <Title>{name}, we are search a connection for you. Please wait.</Title>
      <SubTitle>Contacting…</SubTitle>
    </Wrapper>
  );
};

export default Info;
