import { useRef } from 'react';
import { ActivityIndicator, Modal, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Container, ContainerBox } from './styles';
import Close from '@src/components/common/Close';
import useRemoteAsset from '@src/hooks/useRemoteAsset';

const NewChalk = ({
  text,
  visible,
  toggleModal,
}: {
  text: string;
  visible: boolean;
  toggleModal: () => void;
}) => {
  const animation = useRef(null);
  const { data, loading } = useRemoteAsset(
    'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/app-assets%2Flottiefiles%2Fradar.json?alt=media&token=4f377968-7661-4911-8868-4de72991e798'
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <Container>
        <ContainerBox>
          {data ? (
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 200,
                height: 200,
                backgroundColor: 'transparent',
              }}
              source={data}
            />
          ) : (
            <Text>Error loading animation</Text>
          )}
          <Text>{text}</Text>
          <Close size={60} onPress={async () => toggleModal()} />
        </ContainerBox>
      </Container>
    </Modal>
  );
};

export default NewChalk;
