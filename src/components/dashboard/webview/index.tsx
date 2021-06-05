import { BannerAdSize } from '@react-native-firebase/admob';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import FullBannerAd from '../../common/ad/banner';
import VtHeader from '../../common/header';
import useStyle from './styles';

const VtWebView = ({ route }) => {
  const styles = useStyle();
  const url = route?.params?.url;
  const title = route?.params?.title;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <VtHeader title={title ?? 'News'} back />
      <WebView
        source={{ uri: url ?? 'https://www.google.com' }}
        style={{ backgroundColor: 'white' }}
      />
      <FullBannerAd size={BannerAdSize.FULL_BANNER} />
    </SafeAreaView>
  );
};

export default VtWebView;
