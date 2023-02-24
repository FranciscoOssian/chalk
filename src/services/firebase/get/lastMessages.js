import database from '@react-native-firebase/database';

export default async function getLastMessages(chatName, uid) {
  return new Promise((resolve, reject) => {
    run(chatName, uid, (msgs) => {
      resolve(msgs);
    });
  });
}

function run(chatName, myId, callback) {
  database()
    .ref(`chats/${chatName}/queues/${myId}`)
    .once('value')
    .then((snapshot) => {
      const prev = snapshot.val() ? snapshot.val() : [];
      callback(prev);
    });
}
