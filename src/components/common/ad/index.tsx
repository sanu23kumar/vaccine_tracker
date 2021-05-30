import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import React from 'react';
import { View } from 'react-native';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-9968987511053896/7614438312';

const FullBannerAd = ({ style }) => {
  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.SMART_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default FullBannerAd;
