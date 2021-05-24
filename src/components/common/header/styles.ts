import { StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
import useVtTheme from '../../../assets/theme/useVtTheme';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    headerParent: {
      paddingLeft: 20,
      paddingTop: 20,
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 3,
      backgroundColor: colors.BACKGROUND,
    },
    headerText: {
      fontFamily: fonts.BOLD,
      fontSize: 32,
      color: colors.TEXT,
    },
  });
};

export default useStyle;
