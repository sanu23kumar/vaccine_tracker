import { StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
import useVtTheme from '../../../assets/theme/useVtTheme';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    noDataParent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noDataText: {
      fontSize: 14,
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_DISABLED,
      opacity: 0.5,
    },
    notifyText: {
      fontSize: 16,
      fontFamily: fonts.MEDIUM,
      color: colors.SECONDARY,
    },
    notifyParent: {
      marginTop: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: colors.SECONDARY,
    },
  });
};

export default useStyle;
