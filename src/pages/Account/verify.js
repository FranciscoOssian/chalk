import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, Alert, Text } from 'react-native';
import styled from 'styled-components';

import ThemeProvider from '../../Providers/theme';
import Back from '../../components/common/Back';
import baseInput from '../../components/common/BaseInput';
import Pic from '../../components/common/Image';
import Row from '../../components/common/Row';
import SafeArea from '../../components/common/SafeArea';
import Container from '../../components/pages/Account/Container';
import useUser from '../../hooks/useUser';
import setFireUser from '../../services/firebase/set/user';
import setRealmUser from '../../services/realm/set/user';

function MyProfile({ navigation }) {
  const { t } = useTranslation();
  const [sended, setSended] = useState();
  const [confirm, setConfirm] = useState();
  const [countryCode, setCountryCode] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [code, setCode] = useState();

  const { user, refresh } = useUser();

  async function verifyPhoneNumber(phone) {
    return auth().verifyPhoneNumber(phone);
  }

  async function confirmCode(confirm, code) {
    const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
    await auth().currentUser.linkWithCredential(credential);
  }

  return (
    <Main>
      <Back onPress={() => navigation.goBack()} />
      <Pic uri={user.profilePicture} width={100} />
      <Container>
        {!sended ? (
          <Row>
            <Input
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={countryCode}
              onChangeText={(v) => {
                if (v.length === 1 && v[0] !== '+') setCountryCode('+' + v);
                else setCountryCode(v);
              }}
              placeholder={t('+xx')}
            />
            <Input
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={phoneNumber}
              onChangeText={(v) => setPhoneNumber(v)}
              placeholder={t('xxxxxxxxxxx')}
            />
          </Row>
        ) : (
          <Input
            keyboardType="numeric"
            value={code}
            onChangeText={(v) => setCode(v)}
            placeholder={t('Enter your code')}
          />
        )}

        <TouchableOpacity
          onPress={async () => {
            Alert.alert('wait...');
            if (!sended) {
              const c = await verifyPhoneNumber(countryCode + phoneNumber);
              setConfirm(c);
              setSended(true);
            } else {
              await confirmCode(confirm, code);
              Alert.alert('confirmed phone!');
              refresh();
              auth().onAuthStateChanged((u) => {
                if (!u.phoneNumber) return;
                setFireUser({ authenticated: true }, 'update');
              });
              const { name, age, bio, profilePicture, id } = user;
              setRealmUser({ name, age, bio, profilePicture, id, authenticated: true });
            }
          }}>
          <Text
            style={{
              width: 50,
              height: 50,
              fontSize: 40,
              backgroundColor: '#0584FE',
              justifyContent: 'center',
              textAlign: 'center',
              borderRadius: 100,
              color: 'white',
              marginTop: 50,
            }}>{`>`}</Text>
        </TouchableOpacity>
      </Container>
    </Main>
  );
}

export default function (props) {
  return (
    <SafeArea>
      <ThemeProvider>
        <MyProfile {...props} />
      </ThemeProvider>
    </SafeArea>
  );
}

const Main = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 95%;
`;

const Input = styled(baseInput)`
  margin: 10px;
  padding: 10px;
`;
