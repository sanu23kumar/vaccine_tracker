import { StyleSheet } from 'react-native';
import useVtTheme from '../../../assets/theme/useVtTheme';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    iconStyle: {
      alignSelf: 'center',
      paddingHorizontal: 20,
      color: colors.TEXT,
    },
    parent: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
  });
};

export default useStyle;
