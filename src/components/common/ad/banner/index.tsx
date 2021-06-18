import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import React from 'react';
import { View } from 'react-native';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-9968987511053896/3621170643';

const FullBannerAd = ({ style, size = BannerAdSize.SMART_BANNER }) => {
  return (
    <View style={style}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default FullBannerAd;
