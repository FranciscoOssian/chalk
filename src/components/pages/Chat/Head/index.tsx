import { useNavigation } from '@react-navigation/native';

import ProfilePicture from '../../../common/Image';
import Back from '../Back';
import CameraCall from '../CameraCall';
import PhoneCall from '../PhoneCall';
import { HeadWrapper, Container, Name, Status, PerfilInfo, Icons } from './styles';

const Head = ({ pic, name, status, onPerfilPress }: any) => {
  const nav = useNavigation();
  return (
    <HeadWrapper>
      <Back onPress={() => nav.navigate('/')} />
      <PerfilInfo onPress={() => onPerfilPress()}>
        <ProfilePicture uri={pic} width={36} />
        <Container>
          <Name>{name}</Name>
          <Status>{status}</Status>
        </Container>
      </PerfilInfo>
      <Icons>
      </Icons>
    </HeadWrapper>
  );
};

export default Head;
