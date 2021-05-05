import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const useStyle = () => {
  const {colors} = useTheme();

  return StyleSheet.create({
    parent: {flex: 1},
    pinInput: {
      color: colors.text,
      fontSize: 32,
    },
    pinParent: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    hospitalAddress: {
      color: colors.text,
      opacity: 0.5,
      fontSize: 16,
      width: '60%'
    },
    hospitalName: {
      color: colors.text,
      fontSize: 20,
      width: '60%'
    },
    hospitalHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    },
    hospitalParent: {
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 4,
      marginBottom: 4,
      marginHorizontal: 16,
      elevation: 4
    },
    hospitalFeeType: {
      color: colors.primary,
      fontSize: 18
    },
    sessionCapacity: {
      color: colors.text
    },
    sessionDate: {
      color: colors.text,
      opacity: 0.4,
      fontSize: 16,
      paddingBottom: 12
    },
    sessionAgeLimit: {
      color: colors.text
    },
    sessionsText: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 12,
      marginBottom: 6
    },
    sessionParent: {
      padding: 8,
      backgroundColor: colors.background,
      borderRadius: 8,
      width: 160,
    }
  });
};

export default useStyle;
