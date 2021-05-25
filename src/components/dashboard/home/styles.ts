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
      fontSize: 12,
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_DISABLED,
      textTransform: 'lowercase',
    },
    hospitalActionParent: {},
    hospitalAgeParent: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    hospitalVaccineDetailsParent: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: 8,
    },
    hospitalCard: {
      marginBottom: 40,
      marginHorizontal: 20,
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    hospitalContent: {},
    hospitalName: {
      fontFamily: fonts.MEDIUM,
      fontSize: 18,
      paddingBottom: 2,
    },
    hospitalFeeType: {
      fontFamily: fonts.MEDIUM,
      color: colors.SECONDARY,
      fontSize: 14,
      textTransform: 'uppercase',
      paddingLeft: 6,
    },
    hospitalAddress: {
      fontFamily: fonts.REGULAR,
      fontSize: 14,
      paddingBottom: 12,
      color: colors.TEXT_DISABLED,
    },
    hospitalMinAge: {
      fontFamily: fonts.MEDIUM,
      fontSize: 14,
      paddingLeft: 12,
      color: colors.TEXT_DISABLED,
    },
    hospitalVaccine: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
      flexWrap: 'wrap',
      color: colors.TERTIARY,
      paddingLeft: 24,
    },
    hospitalAvailable: {
      fontFamily: fonts.MEDIUM,
      fontSize: 14,
      color: colors.TEXT_LIGHT,
    },
    hospitalAvailableText: {
      fontFamily: fonts.REGULAR,
      fontSize: 10,
      paddingLeft: 3,
      paddingBottom: 1.5,
      color: colors.TEXT_LIGHT,
    },
    hospitalYrsText: {
      fontFamily: fonts.REGULAR,
      fontSize: 10,
      paddingLeft: 3,
      paddingBottom: 1.5,
      color: colors.TEXT_DISABLED,
    },
    actionParent: {
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 4,
      alignItems: 'center',
    },
    actionText: {
      fontFamily: fonts.MEDIUM,
      fontSize: 14,
    },
    district: {
      paddingHorizontal: 20,
      fontFamily: fonts.MEDIUM,
      textTransform: 'uppercase',
      fontSize: 12,
      color: colors.TEXT_DISABLED,
      paddingBottom: 6,
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
      fontSize: 16,
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
    filterAge: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    filterVaccine: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    filterParent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    filterText: {
      fontFamily: fonts.MEDIUM,
      fontSize: 13,
      color: colors.TEXT_DISABLED,
    },
    filterSeparator: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
      color: colors.TEXT_DISABLED,
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
