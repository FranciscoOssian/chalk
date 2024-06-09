import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import ThemeProvider from '@providers/theme';
import BlockButtons from '@components/common/BlockButtons';
import ButtonRow from '@components/common/ButtonRow';
import ProfileHead from '@components/common/ProfileHead';
import SafeArea from '@components/common/SafeArea';
import { useTranslation } from 'react-i18next';
import Snackbar from 'react-native-snackbar';
import auth from '@react-native-firebase/auth';
import RNAdvertisingId from 'react-native-advertising-id';

import useUser from '@src/hooks/useUser';
import useMyId from '@src/hooks/useMyId';

import AgePicker from '@src/components/pages/Account/PickerAge';
import GenderPicker from '@src/components/pages/Account/PickerGender';
import MatchConfigType from '@src/types/matchConfig';
import PickerMatchLanguage from '@src/components/pages/Account/PickerMatchLanguage';
import PickerAppLang from '@src/components/pages/Account/PickerAppLang';

import localStorage from '@src/services/localStorage';

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
import deleteEntireDatabase from '@src/services/realm/delete/deleteEntireDatabase';
import delUser from '@src/services/firebase/del/user';
import setUser from '@src/services/firebase/set/user';

function Profile({ navigation, route }: any) {
  const user = useUser(route.params.id);
  const myId = useMyId();

  const hiddenInMyPage = useMemo(() => user.id === myId, [user, myId]);
  const hiddenInFriendPage = useMemo(() => user.id !== myId, [user, myId]);

  const chatName = useMemo(() => [user?.id, myId].sort().join('-'), [myId, user]);

  const { t: translation, i18n } = useTranslation();
  const t = (s: string) => translation<string>(s);

  const realm = realmContext.useRealm();

  const [appLanguage, setAppLanguage] = useState('');
  const { matchConfig, setMatchConfig } = useMatchConfig();

  const onHandleSetAppLanguage = async (s: string) => {
    setAppLanguage(s);
    await localStorage('appLanguage').set(s);
    i18n.changeLanguage(s);
  };

  const me = useUser();

  const onHandleSetMatchConfig = async (config: MatchConfigType) => {
    config = { ...config, ...matchConfig };
    setMatchConfig({
      from: config.from ?? me.matchingConfig.from,
      to: config.to ?? me.matchingConfig.to,
      genders: config.genders ?? me.matchingConfig.genders,
      lang: config.lang ?? me.matchingConfig.lang,
    });
    setUser({
      user: {
        matchingConfig: {
          from: config.from ?? me.matchingConfig.from,
          to: config.to ?? me.matchingConfig.to,
          genders: config.genders ?? JSON.parse(JSON.stringify(me.matchingConfig.genders)),
          lang: config.lang ?? me.matchingConfig.lang,
        },
      },
      update: true,
    });
  };

  useEffect(() => {
    const run = async () => {
      const appL = await localStorage('appLanguage').get();
      setAppLanguage(appL);
    };
    run();
  }, []);

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
              : Alert.alert(t(`You only can edit your profile if is verified`));
          }}
        />
        <ButtonRow
          hidden={user.authenticated}
          title={t('Verify your account')}
          onPress={() => navigation.navigate('/account/verify')}
        />
      </BlockButtons>

      <BlockButtons title={t('match config')} hidden={hiddenInFriendPage}>
        <ButtonRow mode={{ type: 'accordion', height: 100 }} title={t('age')}>
          <AgePicker
            initial={{ from: matchConfig.from, to: matchConfig.to }}
            callback={({ to, from }) => {
              const temp = { ...matchConfig };
              temp.from = from;
              temp.to = to;
              onHandleSetMatchConfig(temp);
            }}
          />
        </ButtonRow>
        <ButtonRow mode={{ type: 'accordion', height: 50 }} title={t('gender')}>
          <GenderPicker
            initial={[...matchConfig.genders]}
            callback={(seleteds) => onHandleSetMatchConfig({ ...matchConfig, genders: seleteds })}
          />
        </ButtonRow>

        <ButtonRow
          mode={{ type: 'accordion', height: 50 }}
          title={`${t('matchLanguageText')} (${t('current')} - ${matchConfig.lang})`}>
          <PickerMatchLanguage
            initial={matchConfig.lang}
            callback={(seleted) => onHandleSetMatchConfig({ ...matchConfig, lang: seleted })}
          />
        </ButtonRow>
      </BlockButtons>

      <BlockButtons title={t('app config')} hidden={hiddenInFriendPage}>
        <ButtonRow
          mode={{ type: 'accordion', height: 50 }}
          title={`${t('App language')} (${t('current')} - ${appLanguage})`}>
          <PickerAppLang initial={appLanguage} callback={(lang) => onHandleSetAppLanguage(lang)} />
        </ButtonRow>
      </BlockButtons>

      <BlockButtons title={t('privacy')} hidden={hiddenInMyPage}>
        <ButtonRow
          title={t('Block this user')}
          onPress={() => {
            cascadeAlerts([
              {
                title: 'Confirmation',
                message: 'Are you sure you want to block this user?',
                onConfirm: () => {
                  if (!user.id || !myId) return;
                  setBlockedUsers(myId, [user.id]);
                },
              },
              {
                title: 'Confirmation',
                message: 'Do you want to remove this user from your friends?',
                onConfirm: () => {
                  if (!user.id || !myId) return;
                  removeFriendOfList(myId, user.id);
                  deleteChat(chatName, realm);
                  deleteUser(user.id, realm);
                },
              },
            ]);
            navigation.navigate('/');
          }}
        />
        <ButtonRow title={t('Report user')} mode={{ type: 'accordion', height: 100 }}>
          <ReportComponent t={translation} id={user.id} />
        </ButtonRow>
        <ButtonRow title={t('Terms and policies')} onPress={() => {}} />
      </BlockButtons>

      <BlockButtons title={t('Account')} hidden={hiddenInFriendPage}>
        <ButtonRow
          title={t('exit')}
          onPress={() => {
            Alert.alert(
              t('confirmation'),
              t('confirm'),
              [
                {
                  text: t('cancel'),
                  onPress: () => console.log('Cancelado'),
                  style: 'cancel',
                },
                {
                  text: t('confirm'),
                  onPress: async () => {
                    try {
                      realm.write(() => {
                        realm.deleteAll();
                      });
                      console.log('Realm deletado com sucesso!');

                      await localStorage('').AsyncStorage.clear();
                      console.log('Armazenamento local limpo com sucesso!');

                      await auth().signOut(); // Faz logout do usuário
                      console.log('Usuário desconectado com sucesso!');

                      navigation.navigate('/signin');
                    } catch (error) {
                      console.error('Erro ao deletar Realm:', error);
                    }
                  },
                },
              ],
              { cancelable: true }
            );
          }}
        />

        <ButtonRow
          title={t('Delete account')}
          onPress={() => {
            Alert.alert(
              'Delete all user data?',
              'This will be delete your data permanently',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm',
                  style: 'destructive',
                  onPress: () => {
                    delUser(myId || '');
                    auth()
                      .currentUser?.delete()
                      .then(() => console.log('User deleted'))
                      .catch((error) => console.log(error));
                    deleteEntireDatabase(realm);
                    navigation.navigate('/account/signup');
                  },
                },
              ],
              { cancelable: true }
            );
          }}
        />
      </BlockButtons>

      <BlockButtons title={t('Admin')} hidden={hiddenInMyPage}>
        <ButtonRow
          title={t('soft ban')}
          onPress={async () => {
            RNAdvertisingId.getAdvertisingId()
              .then((response) => {
                console.log(response.isLimitAdTrackingEnabled, response.advertisingId);
                Alert.alert(`${response.isLimitAdTrackingEnabled}`, response.advertisingId);
              })
              .catch((error) => console.error(error));
          }}
        />
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

const ReportComponent = ({ t, id }: { id: string | undefined; t: any }) => {
  const [reportMessage, setReportMessage] = useState('');
  return (
    <Row>
      <ReportInput
        multiline
        value={reportMessage}
        onChangeText={(txt) => setReportMessage(txt)}
        placeholder={t`describe your report` + `\n` + t`(please use english or portuguese)`}
      />
      <MaterialCommunityIcons
        name="send-circle-outline"
        size={50}
        color="red"
        onPress={async () => {
          createUserReport(id, {
            reason: reportMessage,
          })
            .then(() => {
              Alert.alert(t`User reported`);
              setReportMessage('');
            })
            .catch((e) =>
              Snackbar.show({
                text: `Error, ${e.message}`,
                duration: Snackbar.LENGTH_SHORT,
              })
            );
        }}
      />
    </Row>
  );
};

function cascadeAlerts(alerts: any, index = 0) {
  if (index >= alerts.length) return;

  const currentAlert = alerts[index];

  Alert.alert(
    currentAlert.title,
    currentAlert.message,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: () => {
          currentAlert.onConfirm();
          cascadeAlerts(alerts, index + 1);
        },
      },
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
`;

const ReportInput = styled(BaseInput)`
  min-width: 50%;
  max-width: 85%;
  padding: 10px;
`;
