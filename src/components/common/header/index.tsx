import {
  InterstitialAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useStyle from './styles';

const VtHeader = ({ children = undefined, title, back }) => {
  const styles = useStyle();
  const { goBack } = useNavigation();
  const goToDashboard = () => {
    if (goBack) goBack();
  };
  return (
    <View style={styles.headerParent}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {!back ? null : (
          <Pressable
            onPress={goToDashboard}
            style={{ paddingRight: 12 }}
            hitSlop={12}>
            <Icon name="arrow-back-outline" size={28} />
          </Pressable>
        )}
        <Text
          style={[styles.headerText, { fontSize: back ? 24 : 32 }]}
          numberOfLines={1}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
};

export default VtHeader;
