import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import strings from '../../../assets/strings';
import useStyle from './styles';

const NoDataView = () => {
  const styles = useStyle();
  const { navigate } = useNavigation();
  const onPressNotify = () => {
    navigate(strings.dashboard.notifications.NAME);
  };
  return (
    <View style={styles.noDataParent}>
      <Text style={styles.noDataText}>No data found</Text>
      <Pressable onPress={onPressNotify} style={styles.notifyParent}>
        <Text style={styles.notifyText}>Notify me when slots open up</Text>
      </Pressable>
    </View>
  );
};

export default NoDataView;
