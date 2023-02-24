import { useEffect, useState } from 'react';

import getRealmUser from '../../services/realm/get/user';

const defaultPic =
  'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/public%2FdefaultProfilePicture.jpg?alt=media&token=ac1c66c3-903e-482b-8cce-4d945b2159c1';

export default function useFriend(id) {
  const [friend, setFriend] = useState({
    name: '',
    age: 18,
    bio: '',
    profilePicture: defaultPic,
    id: 0,
  });

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      setFriend(await getRealmUser(id));
    };
    run();
  }, []);

  return { friend };
}
