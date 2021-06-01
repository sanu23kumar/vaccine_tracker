import { StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
import useVtTheme from '../../../assets/theme/useVtTheme';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    text: {
      fontSize: 16,
      fontFamily: fonts.MEDIUM,
      color: colors.SECONDARY,
    },
    parent: {
      marginTop: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 0.5,
      margin: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.SECONDARY,
    },
  });
};

export default useStyle;
