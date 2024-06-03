import realmContext from '@contexts/realm';
import ChatType from '@src/types/chat';

const useChats = (id: string | undefined = undefined) => {
  const chats = realmContext.useQuery<ChatType>('Chat');

  if (id) return chats.filtered(`id == '${id}'`);
  else
    return [...chats].sort((a: ChatType, b: ChatType) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const dateB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return dateB - dateA;
    });
};

export default useChats;
