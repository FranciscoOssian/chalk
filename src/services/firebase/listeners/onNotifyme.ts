import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

type Snapshot = FirebaseDatabaseTypes.DataSnapshot;
type Callback = ({ from, message }: { from: string; message: any }) => void;

/**
 * Listens for notifications for current user.
 *
 * @param {Callback} callback - Callback function to handle with notifications.
 * @returns {void}
 */
export const listenToNotifications = (callback: Callback) => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    console.error('No authenticated user found');
    return;
  }

  const ref = database().ref(`notifications/${currentUser.uid}`);

  // Add listener for changes in the notifications node
  ref.on('value', (snapshot: Snapshot) => {
    const notifications = snapshot.val();
    if (notifications) {
      Object.keys(notifications).forEach((from) => {
        const messages = notifications[from];
        messages.forEach((message: any) => {
          callback({ from, message });
        });

        // Remove notifications after processing
        ref.child(from).remove();
      });
    }
  });
};

export default listenToNotifications;
