import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import ThemeProvider from '@providers/theme';
import BlockButtons from '@components/common/BlockButtons';
import ButtonRow from '@components/common/ButtonRow';
import ProfileHead from '@components/common/ProfileHead';
import SafeArea from '@components/common/SafeArea';
import { useTranslation } from 'react-i18next';

import useUser from '@src/hooks/useUser';
import useMyId from '@src/hooks/useMyId';

import AgePicker from '@src/components/pages/Account/PickerAge';
import GenderPicker from '@src/components/pages/Account/PickerGender';
import MatchConfigType from '@src/types/matchConfig';
import PickerMatchLanguage from '@src/components/pages/Account/PickerMatchLanguage';
import PickerAppLang from '@src/components/pages/Account/PickerAppLang';
import { storageExtended } from '@src/utils/storageExtended';

import realmContext from '@contexts/realm';

import useMatchConfig from '@src/hooks/useMatchConfig';
import setBlockedUsers from '@src/services/firebase/set/blockedUsers';
import deleteChat from '@src/services/realm/delete/chat';
import deleteUser from '@src/services/realm/delete/user';
import createUserReport from '@src/services/firebase/create/userResport';
import BaseInput from '@src/components/common/BaseInput';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Row from '@src/components/common/Row';
import removeFriendOfList from '@src/services/firebase/del/friendOfList';
import { defaultAppLanguage } from '@utils/defaultStorage.ts';

function Profile({ navigation, route }: any) {

  const user = useUser(route.params.id);
  const myId = useMyId();

  const hiddenInMyPage = useMemo(() => user.id === myId, [user, myId]);
  const hiddenInFriendPage = useMemo(() => user.id !== myId, [user, myId]);

  const chatName = useMemo(() => [user?.id, myId].sort().join('-'), [myId, user]);

  const { t: translation, i18n } = useTranslation();
  const t = (s: string) => translation<string>(s);

  const [appLanguage, setAppLanguage] = useState('');
  const [matchConfig, setMatchConfig] = useMatchConfig();

  const realm = realmContext.useRealm();

  const onHandleSetAppLanguage = async (s: string) => {
    setAppLanguage(s);
    await storageExtended('appLanguage').set(s);
    i18n.changeLanguage(s);
  };

  const onHandleSetMatchConfig = async (config: MatchConfigType) => {
    setMatchConfig(config);
  }

  useEffect( () => {
    const run = async () => {
      const appL = await storageExtended('appLanguage').get();
      if(appL) setAppLanguage(appL);
      else setAppLanguage(defaultAppLanguage);
    }
    run();
  }, [] )

  return (
    <Main showsVerticalScrollIndicator={false}>
      <ProfileHead 
        user={user}
        onProfilePress={() => navigation.navigate('/image', { list: [user.profilePicture] })}
        onBackPress={navigation.goBack}
      />

      <BlockButtons title={t('perfil config')} hidden={hiddenInFriendPage}>
        <ButtonRow
          title={t('Edit profile')}
          onPress={() => {
            return user.authenticated
              ? navigation.navigate('/account/editor')
              : Alert.alert('You only can edit your profile if is verified');
          }}
        />
        <ButtonRow
          hidden={user.authenticated}
          title={t('Verify your account')}
          onPress={() => navigation.navigate('/account/verify')}
        />
      </BlockButtons>

      <BlockButtons title={t('match config')} hidden={hiddenInFriendPage}>
        <ButtonRow mode={{ type: 'accordion', height: 100 }} title="age">
          <AgePicker
            initial={
              {from: matchConfig.from, to: matchConfig.to}
            }
            callback={({to, from}) => {
              const temp = { ...matchConfig };
              temp.from = from;
              temp.to = to;
              onHandleSetMatchConfig(temp);
            }}
          />
        </ButtonRow>
        <ButtonRow mode={{ type: 'accordion', height: 50 }} title="gender">
          <GenderPicker
            initial={matchConfig.genders}
            callback={ seleteds =>
              onHandleSetMatchConfig({...matchConfig, genders:seleteds})
            }
          />
        </ButtonRow>

        <ButtonRow
          mode={{ type: 'accordion', height: 50 }}
          title={`${t('Match language')} (${t('current')} - ${matchConfig.lang})`}>
          <PickerMatchLanguage
            initial={matchConfig.lang}
            callback={ seleted =>
              onHandleSetMatchConfig({...matchConfig, lang:seleted})
            }
          />
        </ButtonRow>
      </BlockButtons>

      <BlockButtons title={t('app config')} hidden={hiddenInFriendPage}>
        <ButtonRow
          mode={{ type: 'accordion', height: 50 }}
          title={`${t('App language')} (${t('current')} - ${appLanguage})`}>
          <PickerAppLang
            initial={appLanguage}
            callback={lang => onHandleSetAppLanguage(lang)}
          />
        </ButtonRow>
      </BlockButtons>

      <BlockButtons title={t('privacy')} hidden={hiddenInMyPage}>
        <ButtonRow title={t('Block this user')} onPress={() => {
          cascadeAlerts([
            {
              title: 'Confirmation',
              message: 'Are you sure you want to block this user?',
              onConfirm: () => {
                if(!user.id || !myId) return;
                setBlockedUsers(myId, [user.id]);
              }
            },
            {
              title: 'Confirmation',
              message: 'Do you want to remove this user from your friends?',
              onConfirm: () => {
                if(!user.id || !myId) return;
                removeFriendOfList(myId, user.id);
                deleteChat(chatName, realm);
                deleteUser(user.id, realm);
              }
            }
          ])
          navigation.navigate('/');
        }}
      />
        <ButtonRow
          title={t('Report user')}
          mode={{ type: 'accordion', height: 100 }}
        >
          <ReportComponent id={user.id}/>
        </ButtonRow>
        <ButtonRow title={t('Terms and policies')} onPress={() => {}} />
      </BlockButtons>

      <BlockButtons title={t('Account')} hidden={hiddenInFriendPage}>
        <ButtonRow title={t('exit')} onPress={() => {}} />
        <ButtonRow title={t('Delete account')} onPress={() => {}} />
      </BlockButtons>
    </Main>
  );
}

export default function (props: any) {
  return (
    <SafeArea>
      <ThemeProvider>
        <Profile {...props} />
      </ThemeProvider>
    </SafeArea>
  );
}

const ReportComponent = ({id}: {id: string | undefined}) => {
  const [reportMessage, setReportMessage] = useState('');
  return <Row>
    <ReportInput
      multiline
      value={reportMessage}
      onChangeText={txt => setReportMessage(txt)}
      placeholder={`describe your report \n(please use english or portuguese)`}/>
    <MaterialCommunityIcons name="send-circle-outline" size={50} color="red"
      onPress={ async () => {
        createUserReport(id, {
          reason: reportMessage
        })
        .then( () => {
          Alert.alert("User reported")
          setReportMessage('')
        })
        .catch(e => Alert.alert('Error', e.message))
      }}
    />
  </Row>
}

function cascadeAlerts(alerts: any, index = 0) {
  if (index >= alerts.length) return;

  const currentAlert = alerts[index];

  Alert.alert(
    currentAlert.title,
    currentAlert.message,
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Confirm', 
        style: 'destructive',
        onPress: () => {
          currentAlert.onConfirm();
          cascadeAlerts(alerts, index + 1);
        }
      }
    ],
    { cancelable: true }
  );
}


/*
const Main = styled.ScrollView.attrs({
  contentContainerStyle: (props) => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
})`
  flex: 1;
  width: 95%;
`;
*/

const Main = styled.ScrollView`
  flex: 1;
  width: 95%;
`

const ReportInput = styled(BaseInput)`
  min-width: 50%;
  max-width: 85%;
  padding: 10px;
`
