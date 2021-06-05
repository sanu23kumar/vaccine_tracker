import { useNavigation } from '@react-navigation/core';
import useStore from 'potli/useStore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import strings from '../../../assets/strings';
import useVtTheme from '../../../assets/theme/useVtTheme';
import translations from '../../../assets/translations';
import { getAllDistricts } from '../../../services';
import { useDistrictsStore } from '../../../services/stores';
import VtHeader from '../../common/header';
import { Separator } from '../home/FilterType';
import useStyle from './styles';

// TODO: Update toast strings
const Settings = () => {
  const styles = useStyle();
  const { data: userLanguage, setData: setUserLanguage } = useStore('LANGUAGE');
  const { colors } = useVtTheme();
  const { reset } = useNavigation();
  const [isRefreshingDistricts, setIsRefreshingDistricts] = useState(false);
  const { setDistrictsData } = useDistrictsStore();

  const onPressRefreshStates = async () => {
    setIsRefreshingDistricts(true);
    const districtsResponse = await getAllDistricts();
    if (districtsResponse?.length > 0) {
      setDistrictsData({ states: districtsResponse });
      ToastAndroid.show('Districts updated ', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        'Update failed, please try sometime later',
        ToastAndroid.SHORT,
      );
    }
    setIsRefreshingDistricts(false);
  };

  const languageHelper = (name: string, language?: string) => {
    setUserLanguage({ name });
    translations.setLanguage(language ?? name);
    reset({
      index: 1,
      routes: [
        { name: 'Dashboard' },
        { name: strings.dashboard.settings.NAME },
      ],
    });
  };

  const setDefaultLanguage = () =>
    languageHelper(undefined, translations.getInterfaceLanguage());

  const setHindi = () => languageHelper('hi');
  const setEnglish = () => languageHelper('en');

  return (
    <SafeAreaView style={styles.parent}>
      <VtHeader title={translations.SETTINGS_SCREEN_TITLE} />
      <View style={styles.sectionParent}>
        <Text style={styles.languageText}>
          {translations.SETTINGS_LANGUAGE}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={setDefaultLanguage}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userLanguage?.name === undefined
                      ? colors.PRIMARY
                      : colors.TEXT_LIGHT,
                },
              ]}>
              {translations.SETTINGS_DEFAULT}
            </Text>
          </Pressable>
          <Separator />
          <Pressable onPress={setHindi}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userLanguage?.name === 'hi'
                      ? colors.PRIMARY
                      : colors.TEXT_LIGHT,
                },
              ]}>
              हिंदी
            </Text>
          </Pressable>
          <Separator />
          <Pressable onPress={setEnglish}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userLanguage?.name === 'en'
                      ? colors.PRIMARY
                      : colors.TEXT_LIGHT,
                },
              ]}>
              English
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={onPressRefreshStates} style={styles.refetchParent}>
        <View>
          <Text style={styles.refetchText}>
            {translations.SETTINGS_AUTOCOMPLETE_DATA}
          </Text>
          <Text style={styles.refetchStateText}>
            {translations.SETTINGS_REFETCH_DISTRICTS}
          </Text>
        </View>
        <ActivityIndicator
          animating={isRefreshingDistricts}
          color={styles.refetchIconStyle.color}
          size={24}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
