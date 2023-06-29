import realmContext from '@contexts/realm';
import ChatType from '@src/types/chat';

const useChats = (id: string | undefined = undefined) => {
  const chats = realmContext.useQuery<ChatType>('Chat')

  if(id)
    return chats.filtered(`id == '${id}'`);
  else
    return chats;
};

export default useChats;
