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
      fontSize: 18,
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_DISABLED,
      fontWeight: 'bold',
      opacity: 0.3,
    },
  });
};

export default useStyle;
