import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function createNotification(to: string) {
  const path = `notifications/${to}/${auth().currentUser?.uid}`;

  return {
    send: (data: never) =>
      database()
        .ref(path)
        .once('value')
        .then((snapshot) => {
          const prev = snapshot.val() ? (snapshot.val() as []) : [];
          if (
            prev.some((notification) => {
              return JSON.stringify(notification) === JSON.stringify(data);
            })
          )
            return;
          database()
            .ref(path)
            .set([...prev, data]);
        }),
  };
}
