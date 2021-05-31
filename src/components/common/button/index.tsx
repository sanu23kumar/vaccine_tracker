import React from 'react';
import { Pressable, Text } from 'react-native';
import useStyle from './styles';

const VtButton = ({ title, onPress }) => {
  const styles = useStyle();
  return (
    <Pressable onPress={onPress} style={styles.parent}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default VtButton;
