import { BannerAdSize } from '@react-native-firebase/admob';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Text, View } from 'react-native';
import strings from '../../../assets/strings';
import translations from '../../../assets/translations';
import FullBannerAd from '../ad/banner';
import VtButton from '../button';
import useStyle from './styles';

const NoDataView = () => {
  const styles = useStyle();
  const { navigate } = useNavigation();
  const onPressNotify = () => {
    navigate(strings.dashboard.notifications.NAME);
  };
  return (
    <View style={styles.noDataParent}>
      <FullBannerAd
        style={styles.adStyle}
        size={BannerAdSize.MEDIUM_RECTANGLE}
      />
      <Text style={styles.noDataText}>
        {translations.HOME_ZERO_RESULT_TEXT}
      </Text>
      <VtButton
        title={translations.HOME_SCREEN_NOTIFY_ME_TEXT}
        onPress={onPressNotify}
      />
    </View>
  );
};

export default NoDataView;
