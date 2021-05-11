import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

const useStyle = () => {
  const {colors} = useTheme();

  return StyleSheet.create({
    noDataParent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noDataText: {
      fontSize: 18,
      color: colors.text,
      fontWeight: 'bold',
      opacity: 0.3,
    },
  });
};

export default useStyle;
