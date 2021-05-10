import React from 'react';
import {Text, View} from 'react-native';
import useStyle from './styles';

const ErrorView = () => {
  const styles = useStyle();
  return (
    <View style={styles.noDataParent}>
      <Text style={styles.noDataText}>Something went wrong</Text>
    </View>
  );
};

export default ErrorView;
