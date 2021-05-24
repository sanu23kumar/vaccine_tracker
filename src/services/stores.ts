import useStore from 'potli/useStore';
import { QueryKey } from 'react-query';

export const STORE_USER_KEY = 'user';

export const useUserStore = () => {
  const { data, setData } = useStore(STORE_USER_KEY);
  return { data, setData };
};

export const STORE_QUERY_KEY = 'queries';

export const useQueryStore = () => {
  const { data, setData } = useStore(STORE_QUERY_KEY);
  const setPersistedData = (key: QueryKey, newData) => {
    setData({ [key.toString()]: newData });
  };
  const getPersistedData = (key: QueryKey) => {
    if (!data) return undefined;
    return data[key.toString()];
  };
  return { getPersistedData, setPersistedData };
};
