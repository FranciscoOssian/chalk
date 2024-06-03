import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';

const useRemoteAsset = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRemote = async () => {
      try {
        const asset = Asset.fromURI(url);
        await asset.downloadAsync();
        const response = await fetch(asset.uri);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error loading remote JSON asset:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRemote();
  }, []);

  return {
    data,
    loading,
  };
};

export default useRemoteAsset;
