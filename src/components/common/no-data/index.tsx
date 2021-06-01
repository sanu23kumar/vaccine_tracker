import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Text, View } from 'react-native';
import strings from '../../../assets/strings';
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
      <Text style={styles.noDataText}>No data found</Text>
      <VtButton title="Notify me when slots open up" onPress={onPressNotify} />
    </View>
  );
};

export default NoDataView;
