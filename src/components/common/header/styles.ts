import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    headerParent: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 3,
      backgroundColor: colors.background,
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 32,
      color: colors.text,
    },
  });
};

export default useStyle;
