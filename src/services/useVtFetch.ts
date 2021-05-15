import {QueryKey, useQuery, useQueryClient} from 'react-query';
export const baseUrl = 'https://cdn-api.co-vin.in/api';
export const fetchConfig = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'user-agent':
      'application-name/1.6.7.42 Dalvik/2.1.0 (Linux; U; Android 5.1.1; Android SDK built for x86 Build/LMY48X)',
  },
};

export const useVtPrefetch = <T>() => {
  const queryClient = useQueryClient();
  const prefetch = async (key: QueryKey, URL: string) => {
    await queryClient.prefetchQuery<T>(key, () =>
      fetch(baseUrl + URL, fetchConfig).then(res => res.json()),
    );
  };
  return prefetch;
};

const useVtFetch = <T>(key: QueryKey, URL: string) => {
  return useQuery<T>(
    key,
    () => fetch(baseUrl + URL, fetchConfig).then(res => res.json()),
    {
      onSuccess: data => {
        console.log(data);
      },
      onError: e => {
        console.log('Error', e);
      },
    },
  );
};

export default useVtFetch;
