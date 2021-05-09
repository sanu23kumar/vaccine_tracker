import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from 'react-query';
import Store from '../store';
import RootNavigator from './navigation';

const queryClient = new QueryClient();
const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Store>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </Store>
    </QueryClientProvider>
  );
};

export default Root;
