import Store from 'potli/Store';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import ThemeProvider from '../assets/theme';
import CreateNotificationProvider from '../notifications/createNotificationProvider';
import RootNavigator from './navigation';

export const STORE_KEY = 'VACCINE_TRACKER_STORE';
const queryClient = new QueryClient();
const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Store storeKey={STORE_KEY}>
        <CreateNotificationProvider>
          <SafeAreaProvider>
            <ThemeProvider>
              <RootNavigator />
            </ThemeProvider>
          </SafeAreaProvider>
        </CreateNotificationProvider>
      </Store>
    </QueryClientProvider>
  );
};

export default Root;
