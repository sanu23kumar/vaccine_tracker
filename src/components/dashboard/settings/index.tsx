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
import InAppReview from 'react-native-in-app-review';
import fonts from '../../../assets/fonts';
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
  const { data: userTheme, setData: setUserTheme } = useStore('THEME');
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

  const themeHelper = (name: string) => {
    setUserTheme({ name });
    reset({
      index: 1,
      routes: [
        { name: 'Dashboard' },
        { name: strings.dashboard.settings.NAME },
      ],
    });
  };

  const setDefaultTheme = () => themeHelper(undefined);

  const setLightTheme = () => themeHelper('light');
  const setDarkTheme = () => themeHelper('dark');

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

  const onPressFeedback = () => {
    InAppReview.isAvailable();

    // trigger UI InAppreview
    InAppReview.RequestInAppReview()
      .then(hasFlowFinishedSuccessfully => {
        ToastAndroid.show('Thank you so much!', ToastAndroid.SHORT);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.parent}>
      <VtHeader title={translations.SETTINGS_SCREEN_TITLE} />
      <View style={styles.sectionParent}>
        <Text style={styles.languageText}>
          {translations.SETTINGS_LANGUAGE}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={setDefaultLanguage} hitSlop={8}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userLanguage?.name === undefined
                      ? colors.PRIMARY
                      : colors.TEXT,

                  fontFamily:
                    userLanguage?.name === undefined
                      ? fonts.MEDIUM
                      : fonts.REGULAR,
                },
              ]}>
              {translations.SETTINGS_DEFAULT}
            </Text>
          </Pressable>
          <Separator />
          <Pressable onPress={setHindi} hitSlop={8}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userLanguage?.name === 'hi' ? colors.PRIMARY : colors.TEXT,
                  fontFamily:
                    userLanguage?.name === 'hi' ? fonts.MEDIUM : fonts.REGULAR,
                },
              ]}>
              हिंदी
            </Text>
          </Pressable>
          <Separator />
          <Pressable onPress={setEnglish} hitSlop={8}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userLanguage?.name === 'en' ? colors.PRIMARY : colors.TEXT,
                  fontFamily:
                    userLanguage?.name === 'en' ? fonts.MEDIUM : fonts.REGULAR,
                },
              ]}>
              English
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.sectionParent}>
        <Text style={styles.languageText}>{translations.THEME}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={setDefaultTheme} hitSlop={8}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userTheme?.name === undefined
                      ? colors.PRIMARY
                      : colors.TEXT,
                  fontFamily:
                    userTheme?.name === undefined
                      ? fonts.MEDIUM
                      : fonts.REGULAR,
                },
              ]}>
              {translations.THEME_DEFAULT}
            </Text>
          </Pressable>
          <Separator />
          <Pressable onPress={setLightTheme} hitSlop={8}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userTheme?.name === 'light' ? colors.PRIMARY : colors.TEXT,
                  fontFamily:
                    userTheme?.name === 'light' ? fonts.MEDIUM : fonts.REGULAR,
                },
              ]}>
              {translations.THEME_LIGHT}
            </Text>
          </Pressable>
          <Separator />
          <Pressable onPress={setDarkTheme} hitSlop={8}>
            <Text
              style={[
                styles.sectionText,
                {
                  color:
                    userTheme?.name === 'dark' ? colors.PRIMARY : colors.TEXT,
                  fontFamily:
                    userTheme?.name === 'dark' ? fonts.MEDIUM : fonts.REGULAR,
                },
              ]}>
              {translations.THEME_DARK}
            </Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        onPress={onPressRefreshStates}
        hitSlop={8}
        style={styles.refetchParent}>
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
      <Pressable
        onPress={onPressFeedback}
        hitSlop={8}
        style={styles.refetchParent}>
        <View>
          <Text style={styles.refetchText}>{translations.FEEDBACK}</Text>
          <Text style={styles.refetchStateText}>
            {translations.FEEDBACK_MOTIVATION_TEXT}
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
