import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import React from 'react';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-9458634228092807~6610244766';

const FullBannerAd = () => {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

export default FullBannerAd;
