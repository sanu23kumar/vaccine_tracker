import React from 'react';
import { Pressable, Text } from 'react-native';
import useStyle from './styles';

const VtButton = ({ title, onPress, color = undefined }) => {
  const styles = useStyle();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.parent,
        { borderColor: color ?? styles.parent.borderColor },
      ]}>
      <Text style={[styles.text, { color: color ?? styles.text.color }]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default VtButton;
