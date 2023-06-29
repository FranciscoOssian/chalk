import { useEffect, useState, DependencyList } from 'react';

interface UseAsyncProps {
  asyncFunction: () => Promise<any>;
  dependencies: DependencyList;
}

function useAsync({asyncFunction, dependencies}: UseAsyncProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        const result = await asyncFunction();
        if(!result) setData(undefined);
        setData(result);
        setLoading(false);
    }

    fetchData();
  }, dependencies);

  return { data, loading };
}

export default useAsync;
