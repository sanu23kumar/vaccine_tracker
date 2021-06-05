import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({});
};

export default useStyle;
