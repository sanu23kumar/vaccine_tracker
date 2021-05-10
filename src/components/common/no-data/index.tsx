import React from 'react';
import { Text, View } from 'react-native';
import useStyle from './styles';

const NoDataView = () => {
  const styles = useStyle();
  return (
    <View style={styles.noDataParent}>
      <Text style={styles.noDataText}>No data found</Text>
    </View>
  );
};

export default NoDataView;
