import { StyleSheet } from 'react-native';
import fonts, { fontSizes } from '../../../assets/fonts';
import useVtTheme from '../../../assets/theme/useVtTheme';
import { FILTER_COMPONENT_SIZE } from './Filters';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    autocompleteParent: {
      paddingHorizontal: 32,
      paddingBottom: 32,
    },
    containerShadow: {
      elevation: 0,
    },
    dayHeader: {
      width: 32,
      textAlign: 'center',
      fontSize: fontSizes.LABEL,
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_DISABLED,
      textTransform: 'lowercase',
    },
    hospitalActionParent: { alignItems: 'stretch' },
    hospitalAgeParent: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    suggestionText: {
      fontFamily: fonts.REGULAR,
      fontSize: fontSizes.CONTENT,
      color: colors.TEXT,
      paddingVertical: 8,
    },
    suggestionState: {
      fontFamily: fonts.REGULAR,
      fontSize: fontSizes.CONTENT,
      color: colors.TEXT_LIGHT,
      paddingVertical: 8,
    },
    hospitalVaccineDetailsParent: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: 8,
    },
    hospitalCard: {
      marginBottom: 40,
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    hospitalContent: {
      marginHorizontal: 20,
    },
    hospitalName: {
      fontFamily: fonts.MEDIUM,
      fontSize: fontSizes.TITLE,
      paddingBottom: 2,
    },
    hospitalAd: {
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    hospitalAddress: {
      fontFamily: fonts.REGULAR,
      fontSize: fontSizes.CONTENT,
      paddingBottom: 12,
      color: colors.TEXT_LIGHT,
    },
    hospitalMinAge: {
      fontFamily: fonts.MEDIUM,
      fontSize: fontSizes.CONTENT,
      paddingLeft: 12,
      color: colors.TEXT_DISABLED,
    },
    hospitalVaccine: {
      fontFamily: fonts.MEDIUM,
      fontSize: fontSizes.LABEL,
      flexWrap: 'wrap',
      color: colors.TERTIARY,
      paddingLeft: 24,
    },
    hospitalAvailable: {
      fontFamily: fonts.MEDIUM,
      fontSize: fontSizes.CONTENT,
      color: colors.TEXT_LIGHT,
    },
    hospitalAvailableText: {
      fontFamily: fonts.REGULAR,
      fontSize: fontSizes.LABEL,
      paddingLeft: 3,
      paddingBottom: 1,
      color: colors.TEXT_LIGHT,
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
      fontSize: fontSizes.CONTENT,
      color: colors.TEXT,
    },
    selectedDayStyle: {
      color: colors.PRIMARY,
      fontFamily: fonts.BOLD,
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
    filterAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filterActionButtonApply: {
      flex: 1,
      marginLeft: -20,
    },
    filterActionButtonReset: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginRight: 6,
      marginBottom: 16,
      borderColor: colors.TERTIARY,
    },
    filterCountParent: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 16,
      height: 16,
      borderRadius: 10,
      backgroundColor: colors.SECONDARY,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterCountText: {
      fontFamily: fonts.MEDIUM,
      color: colors.BACKGROUND,
      fontSize: 10,
    },
    filterHeaderParent: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 4,
    },
    filterHeaderText: {
      fontFamily: fonts.MEDIUM,
      color: colors.TEXT_LIGHT,
      paddingHorizontal: 6,
      fontSize: fontSizes.LABEL,
    },
    filterSection: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    filterSectionTitle: {
      fontFamily: fonts.MEDIUM,
      fontSize: fontSizes.LABEL,
      color: colors.TEXT_DISABLED,
    },
    filterParent: {
      paddingHorizontal: 20,
      paddingVertical: 4,
      position: 'absolute',
      top: (FILTER_COMPONENT_SIZE - 80) * -1,
      left: 0,
      right: 0,
      zIndex: 3,
      height: FILTER_COMPONENT_SIZE,
      backgroundColor: colors.BACKGROUND,
    },
    filterApply: {
      color: colors.PRIMARY,
    },
    filterReset: {
      fontFamily: fonts.MEDIUM,
      fontSize: fontSizes.CONTENT,
      color: colors.TERTIARY,
    },
    filterText: {
      fontFamily: fonts.MEDIUM,
      fontSize: 16,
      marginBottom: fontSizes.CONTENT,
      color: colors.TEXT_LIGHT,
    },
    suggestionTextParent: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    filterType: { flexDirection: 'row' },
    filterSeparator: {
      fontFamily: fonts.MEDIUM,
      fontSize: fontSizes.LABEL,
      marginBottom: 16,
      paddingHorizontal: 8,
      opacity: 0.3,
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
