import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';

type QueueSnapshot = FirebaseDatabaseTypes.DataSnapshot;
type QueueRef = FirebaseDatabaseTypes.Reference;

export type ChatName = string;
export type QueueName = string;
export type ChatQueueChangeListener = (
  dataSnapshot: QueueSnapshot,
  queueRef: QueueRef
) => Promise<void>;

/**
 * Listens for changes in the queue of a specific chat.
 *
 * @param {ChatName} chatName - The name of the chat.
 * @param {QueueName} queue - The name of the chat queue.
 * @param {ChatQueueChangeListener} callback - Callback function to handle changes in the queue.
 * @returns {void}
 */
export const listenToChatQueue = (
  chatName: ChatName,
  queue: QueueName,
  callback: ChatQueueChangeListener
) => {
  const queueRef = database().ref(`chats/${chatName}/queues/${queue}`);
  queueRef.on('value', async (dataSnapshot: QueueSnapshot) => {
    callback(dataSnapshot, queueRef);
  });
};

export default listenToChatQueue;
