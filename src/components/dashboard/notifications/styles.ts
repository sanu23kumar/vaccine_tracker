import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    iconStyle: {alignSelf: 'center', paddingHorizontal: 16},
  });
};

export default useStyle;
