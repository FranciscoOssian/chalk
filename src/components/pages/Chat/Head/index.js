import { useNavigation } from '@react-navigation/native';

import ProfilePicture from '../../../common/Image';
import Back from '../Back';
import CameraCall from '../CameraCall';
import PhoneCall from '../PhoneCall';
import { HeadWrapper, Container, Name, Status, PerfilInfo, Icons } from './styles';

const Head = ({ pic, name, status, onPerfilPress }) => {
  const nav = useNavigation();
  return (
    <HeadWrapper>
      <PerfilInfo onPress={() => onPerfilPress()}>
        <Back onPress={() => nav.goBack()} />
        <ProfilePicture uri={pic} width={36} />
        <Container>
          <Name>{name}</Name>
          <Status>{status}</Status>
        </Container>
      </PerfilInfo>
      <Icons>
        <PhoneCall />
        <CameraCall />
      </Icons>
    </HeadWrapper>
  );
};

export default Head;
