import { StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
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
    refetchParent: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    refetchText: {
      fontSize: 12,
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_DISABLED,
      textTransform: 'uppercase',
    },
    refetchStateText: {
      fontSize: 16,
      fontFamily: fonts.REGULAR,
      color: colors.TEXT,
    },
    refetchIconStyle: {
      color: colors.PRIMARY,
    },
  });
};

export default useStyle;
