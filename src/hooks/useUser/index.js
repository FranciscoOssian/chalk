import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';

import getUser from '../../services/firebase/get/user';
import getUserListinerChanges from '../../services/realm/get/userListnerChanges';

const defaultPic =
  'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/public%2FdefaultProfilePicture.jpg?alt=media&token=ac1c66c3-903e-482b-8cce-4d945b2159c1';

const useUser = () => {
  const [user, setUser] = useState({
    name: '',
    age: 18,
    bio: '',
    profilePicture: defaultPic,
    id: 0,
    authenticated: false,
    gender: undefined,
  });
  const [refresh, setRefresh] = useState(false);

  const [realmDestroy, setRealmDestroy] = useState(() => {});
  const [fireDestroy, setFireDestroy] = useState(() => {});

  const getExternalProfilePictureUri = async () => (await getUser(user.id)).profilePicture;

  useEffect(() => {
    if (realmDestroy) realmDestroy();
    if (fireDestroy) fireDestroy();
    let unsubAuth = () => {};
    let unsubRealm = () => {};
    const run = async () => {
      unsubAuth = auth().onAuthStateChanged(async (usr) => {
        if (!usr) return;
        unsubRealm = await getUserListinerChanges(usr.uid, (user) => {
          setUser(user);
        });
      });
      setFireDestroy(unsubAuth);
      setRealmDestroy(unsubRealm);
    };

    run();

    return () => {
      if (fireDestroy) fireDestroy();
      if (realmDestroy) realmDestroy();
    };
  }, [refresh]);

  return { user, getExternalProfilePictureUri, refresh: () => setRefresh((p) => !p) };
};

export default useUser;
