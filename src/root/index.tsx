import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from 'react-query';
import CreateNotificationProvider from '../notifications/createNotificationProvider';
import Store from '../store';
import RootNavigator from './navigation';

const queryClient = new QueryClient();
const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Store>
        <CreateNotificationProvider>
          <SafeAreaProvider>
            <RootNavigator />
          </SafeAreaProvider>
        </CreateNotificationProvider>
      </Store>
    </QueryClientProvider>
  );
};

export default Root;
