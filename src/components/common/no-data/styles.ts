import { StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
import useVtTheme from '../../../assets/theme/useVtTheme';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    noDataParent: {
      flex: 1,
      justifyContent: 'center',
    },
    noDataText: {
      fontSize: 14,
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_DISABLED,
      opacity: 0.5,
      alignSelf: 'center',
      marginBottom: 16,
    },
    adStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      marginTop: 120,
    },
  });
};

export default useStyle;
