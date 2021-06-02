import Store from 'potli/Store';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import ThemeProvider from '../assets/theme';
import { initialStoreData } from '../services/stores';
import RootNavigator from './navigation';

export const STORE_KEY = 'VACCINE_TRACKER_STORE';
const queryClient = new QueryClient();
const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Store storeKey={STORE_KEY} initialData={initialStoreData}>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </Store>
    </QueryClientProvider>
  );
};

export default Root;
