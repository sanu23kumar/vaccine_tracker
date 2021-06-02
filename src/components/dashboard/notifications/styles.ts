import { StyleSheet } from 'react-native';
import fonts from '../../../assets/fonts';
import useVtTheme from '../../../assets/theme/useVtTheme';
import { HELPER_COMPONENT_SIZE } from './NewHelper';

const useStyle = () => {
  const { colors } = useVtTheme();

  return StyleSheet.create({
    addParent: {
      backgroundColor: colors.BACKGROUND,
      zIndex: 4,
    },
    helperItemParent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    helperItemTextContent: {
      flex: 1,
      paddingRight: 12,
    },
    helperItemEdit: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
      color: colors.TEXT_DISABLED,
    },
    helperItemTitle: {
      fontFamily: fonts.REGULAR,
      fontSize: 18,
      color: colors.TEXT,
      flexShrink: 1,
    },
    helperSwitchParent: { flexDirection: 'row', alignItems: 'center' },
    helperSwitchText: {
      marginRight: 12,
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
    },
    iconStyle: {
      alignSelf: 'center',
      paddingHorizontal: 20,
      color: colors.TEXT,
    },
    parent: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
    filterAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    selectedDayStyle: {
      color: colors.PRIMARY,
      fontFamily: fonts.MEDIUM,
    },
    filterActionButtonApply: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 0.5,
      paddingVertical: 8,
      borderColor: colors.PRIMARY,
      marginBottom: 16,
    },
    filterActionButtonDelete: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 0.5,
      paddingVertical: 8,
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
      fontSize: 14,
    },
    filterSection: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    filterSectionTitle: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
      color: colors.TEXT_DISABLED,
    },
    filterParent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 4,
      position: 'absolute',
      top: HELPER_COMPONENT_SIZE * -1,
      left: 0,
      right: 0,
      zIndex: 3,
      height: HELPER_COMPONENT_SIZE,
      backgroundColor: colors.BACKGROUND,
    },
    filterApply: {
      fontFamily: fonts.MEDIUM,
      fontSize: 16,
      color: colors.PRIMARY,
    },
    filterDelete: {
      fontFamily: fonts.MEDIUM,
      fontSize: 16,
      color: colors.TERTIARY,
    },
    filterReset: {
      fontFamily: fonts.MEDIUM,
      fontSize: 12,
      color: colors.TERTIARY,
    },
    filterText: {
      fontFamily: fonts.MEDIUM,
      fontSize: 16,
      marginBottom: 16,
      color: colors.TEXT_DISABLED,
    },
    filterSubtext: {
      fontFamily: fonts.MEDIUM,
      fontSize: 16,
      marginBottom: 16,
      color: colors.TEXT_DISABLED,
    },
    suggestionTextParent: {
      flexDirection: 'row',
    },
    filterType: { flexDirection: 'row' },
    filterSeparator: {
      fontFamily: fonts.MEDIUM,
      fontSize: 16,
      marginBottom: 16,
      color: colors.TEXT_DISABLED,
    },
    search: {
      fontFamily: fonts.REGULAR,
      paddingHorizontal: 12,
      flex: 1,
      fontSize: 16,
      color: colors.TEXT,
    },
    searchParent: {
      backgroundColor: colors.PRIMARY_LIGHT,
      borderRadius: 8,
      height: 42,
      marginBottom: 20,
      marginTop: 4,
      alignItems: 'center',
      flexDirection: 'row',
    },
    placeholder: {
      color: colors.TEXT_DISABLED,
    },
    locationIconStyle: {
      color: colors.TEXT_DISABLED,
      paddingHorizontal: 12,
    },
  });
};

export default useStyle;
