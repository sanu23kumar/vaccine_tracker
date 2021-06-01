import { StyleSheet } from 'react-native';
import useVtTheme from '../../../assets/theme/useVtTheme';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    parent: {
      justifyContent: 'center',
      height: 16,
      width: 32,
    },
    line: {
      width: 32,
      height: 1,
    },
    circle: {
      width: 16,
      height: 16,
      position: 'absolute',
      borderRadius: 10,
    },
  });
};

export default useStyle;
