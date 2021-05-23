import useStore from 'potli/useStore';

export const STORE_USER_KEY = 'user';

export const useUserStore = () => {
  const { data, setData } = useStore(STORE_USER_KEY);
  return { data, setData };
};
