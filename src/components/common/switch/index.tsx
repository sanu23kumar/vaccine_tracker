import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import useVtTheme from '../../../assets/theme/useVtTheme';
import useStyle from './styles';

const VtSwitch = ({ enabled, onPress }) => {
  const styles = useStyle();
  const { colors } = useVtTheme();
  const switchAnim = useRef(new Animated.Value(enabled ? 16 : 0)).current;
  useEffect(() => {
    Animated.spring(switchAnim, {
      toValue: enabled ? 16 : 0,
      useNativeDriver: true,
    }).start();
  }, [enabled]);
  return (
    <Pressable onPress={onPress} style={styles.parent} hitSlop={12}>
      <View
        style={[
          styles.line,
          { backgroundColor: enabled ? colors.PRIMARY : colors.TEXT_DISABLED },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: enabled ? colors.PRIMARY : colors.TEXT_DISABLED,
            transform: [{ translateX: switchAnim }],
          },
        ]}
      />
    </Pressable>
  );
};

export default VtSwitch;
