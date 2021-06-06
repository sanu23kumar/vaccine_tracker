import {
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from '@react-native-firebase/admob';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import FullBannerAd from '../../common/ad/banner';
import VtHeader from '../../common/header';
import useStyle from './styles';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-9968987511053896/3798853365';

const VtWebView = ({ route }) => {
  const styles = useStyle();
  const url = route?.params?.url;
  const title = route?.params?.title;
  const showAd = route?.params?.showAd;
  const [webviewLoaded, setWebviewLoaded] = useState(false);

  const initerstitial = useRef(InterstitialAd.createForAdRequest(adUnitId))
    .current;
  useEffect(() => {
    const eventListener = initerstitial.onAdEvent((type, error, reward) => {
      if (type === 'loaded') {
        if (showAd !== '0') {
          initerstitial.show();
        }
      }
    });
    initerstitial.load();
    return () => {
      eventListener();
    };
  }, []);

  useEffect(() => {
    if (webviewLoaded && initerstitial.loaded) {
      if (showAd !== '0') {
        initerstitial.show();
      }
    }
  }, [webviewLoaded, initerstitial]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <VtHeader title={title ?? 'News'} back />
      <WebView
        source={{ uri: url ?? 'https://www.google.com' }}
        style={{ backgroundColor: 'white' }}
        onLoadEnd={() => setWebviewLoaded(true)}
      />
      <FullBannerAd size={BannerAdSize.FULL_BANNER} />
    </SafeAreaView>
  );
};

export default VtWebView;
