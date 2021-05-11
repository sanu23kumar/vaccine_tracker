import {useTheme} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

const useStyle = () => {
  const {colors} = useTheme();

  return StyleSheet.create({
    differentLocationText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.6,
    },
    parent: {flex: 1},
    pinInput: {
      color: colors.text,
      fontSize: 24,
    },
    list: {paddingTop: 84},
    pinParent: {
      position: 'absolute',
      top: 66,
      left: 0,
      right: 0,
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      margin: 16,
      borderRadius: 12,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      zIndex: 2,
    },
    iconStyle: {alignSelf: 'center', paddingHorizontal: 16, color: colors.text},
    hospitalAddress: {
      color: colors.text,
      opacity: 0.5,
      fontSize: 16,
      width: '60%',
    },
    hospitalName: {
      color: colors.text,
      fontSize: 20,
      width: '60%',
    },
    hospitalHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      paddingTop: 16,
    },
    card: {
      marginBottom: 4,
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      elevation: 4,
    },
    hospitalParent: {
      paddingHorizontal: 16,
    },
    hospitalFeeType: {
      color: colors.primary,
      fontSize: 18,
    },
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
    sessionCapacity: {
      color: colors.text,
    },
    sessionDate: {
      color: colors.text,
      opacity: 0.4,
      fontSize: 16,
      paddingBottom: 12,
    },
    sessionAgeLimit: {
      color: colors.text,
    },
    sessionsText: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 12,
      marginBottom: 6,
    },
    sessionParent: {
      padding: 8,
      backgroundColor: colors.border,
      borderRadius: 12,
      width: 160,
      marginBottom: 16,
    },
  });
};

export default useStyle;
