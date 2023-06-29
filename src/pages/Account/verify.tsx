import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, Text, Alert } from 'react-native';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ThemeProvider from '@providers/theme';
import Back from '@components/common/Back';
import BaseInput from '@components/common/BaseInput';
import Pic from '@components/common/Image';
import Row from '@components/common/Row';
import SafeArea from '@components/common/SafeArea';
import Container from '@components/pages/Account/Container';
import useUser from '@hooks/useUser';
import realmContext from '@contexts/realm';

import { defaultFirebaseProfilePicture } from '@utils/consts.ts';
import UserType from '@src/types/user';

function MyProfile({ navigation }: any) {
  const { t: translation } = useTranslation();
  const t = (s: string) => translation<string>(s)

  const [sended, setSended] = useState<boolean>();
  const [confirm, setConfirm] = useState<any | null>();
  const [countryCode, setCountryCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [code, setCode] = useState<string>();

  const realm = realmContext.useRealm();

  const user = useUser();

  const onPress = async (): Promise<void> => {
    Alert.alert('wait...');
    if (!sended) {
      const confi = await auth().verifyPhoneNumber(countryCode + phoneNumber);
      setConfirm(confi);
      setSended(true);
    } else {
      try{
        const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
        await auth().currentUser?.linkWithCredential(credential);
      }catch(e: any){
        if(e?.code === 'auth/invalid-verification-code')
          return Alert.alert( t('Auth'), `${t('invalid verification code')} - ${code}` )
      }
      Alert.alert('confirmed phone!');
      auth().onAuthStateChanged(async (u) => {
        if (!u?.phoneNumber) return;
        // Update user verification status in Firebase
        const usersRef = firestore().collection('Users').doc(u.uid);
        await usersRef.update({ authenticated: true });

        // Update user verification status in Realm
        realm.write(() => {
          const user = realm.objects<UserType>('User').filtered(`id = "${u.uid}"`)[0];
          if(!user) return;
          user.authenticated = true;
        });
      });
    }
  }

  return (
    <Main>
      <Back onPress={() => navigation.goBack()} />
      <Pic uri={user?.profilePicture || defaultFirebaseProfilePicture} width={100} />
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
              placeholder={'+xx'}
            />
            <Input
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={phoneNumber}
              onChangeText={(v) => setPhoneNumber(v)}
              placeholder='xxxxxxxxxxx'
            />
          </Row>
        ) : (
          <Input
            keyboardType="numeric"
            value={code}
            onChangeText={(v) => setCode(v)}
            placeholder={`${t('Enter your code')}`}
          />
        )}

        <TouchableOpacity
          onPress={onPress}
        >
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

export default function (props: any) {
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

const Input = styled(BaseInput)`
  margin: 10px;
  padding: 10px;
`;