import { useEffect, useState } from 'react';

import getChatListinerChanges from '../../services/realm/get/chatListnerChanges';

const useChats = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    let unsub = () => {};

    const run = async () => {
      unsub = await getChatListinerChanges((c) => setChats([...c]));
    };

    run();

    return () => {
      unsub();
    };
  }, []);

  return { chats };
};

export default useChats;
