import React from 'react';
import { Text, View } from 'react-native';
import useStyle from './styles';

const VtHeader = ({ children, title }) => {
  const styles = useStyle();
  return (
    <View style={styles.headerParent}>
      <Text style={styles.headerText}>{title}</Text>
      {children}
    </View>
  );
};

export default VtHeader;
