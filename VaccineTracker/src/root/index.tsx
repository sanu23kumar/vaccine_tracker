import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import RootNavigator from './navigation';

const queryClient = new QueryClient();
const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator/>    
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default Root;
