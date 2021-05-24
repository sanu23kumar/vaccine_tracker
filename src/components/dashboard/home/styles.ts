import { StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
import useVtTheme from '../../../assets/theme/useVtTheme';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    containerShadow: {
      elevation: 0,
    },
    dayHeader: {
      width: 32,
      textAlign: 'center',
      fontSize: 10,
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_DISABLED,
      textTransform: 'lowercase',
    },
    hospitalActionParent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    hospitalCard: {
      marginBottom: 40,
      marginHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    hospitalContent: {
      width: '70%',
    },
    hospitalName: {
      fontFamily: fonts.REGULAR,
      fontSize: 18,
      paddingBottom: 2,
    },
    hospitalFeeType: {
      fontFamily: fonts.MEDIUM,
      color: colors.SECONDARY,
      fontSize: 12,
      textTransform: 'uppercase',
      paddingLeft: 6,
    },
    hospitalAddress: {
      fontFamily: fonts.REGULAR,
      fontSize: 12,
      paddingBottom: 8,
      color: colors.TEXT_DISABLED,
    },
    hospitalMinAge: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
      paddingBottom: 4,
      color: colors.TEXT_LIGHT,
    },
    hospitalVaccine: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
      color: colors.TERTIARY,
    },
    hospitalAvailable: {
      fontFamily: fonts.REGULAR,
      fontSize: 12,
      paddingBottom: 4,
      color: colors.TEXT_LIGHT,
    },
    hospitalAvailableText: {
      fontFamily: fonts.REGULAR,
      fontSize: 8,
      color: colors.TEXT_LIGHT,
    },
    actionParent: {
      borderWidth: 0.5,
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    actionText: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
    },
    district: {
      paddingHorizontal: 20,
      fontFamily: fonts.MEDIUM,
      textTransform: 'uppercase',
      fontSize: 10,
      color: colors.TEXT_DISABLED,
      paddingBottom: 12,
    },
    parent: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
      alignItems: 'stretch',
    },
    search: {
      fontFamily: fonts.REGULAR,
      paddingHorizontal: 12,
      flex: 1,
      fontSize: 14,
      color: colors.TEXT,
    },
    selectedDayStyle: {
      color: colors.PRIMARY,
      fontFamily: fonts.MEDIUM,
    },
    searchParent: {
      backgroundColor: colors.PRIMARY_LIGHT,
      borderRadius: 8,
      height: 42,
      marginHorizontal: 20,
      marginBottom: 12,
      alignItems: 'center',
      flexDirection: 'row',
    },
    locationIconStyle: {
      color: colors.TEXT_DISABLED,
      paddingHorizontal: 12,
    },
    placeholder: {
      color: colors.TEXT_DISABLED,
    },
    iconStyle: {
      alignSelf: 'center',
      paddingHorizontal: 20,
      color: colors.TEXT,
    },
  });
};

export default useStyle;
