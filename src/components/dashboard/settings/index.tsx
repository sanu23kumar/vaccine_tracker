import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import translations from '../../../assets/translations';
import { getDistrict, suggestDistricts } from '../../../services';
import { StatesModel } from '../../../services/models/districts';
import { useDistrictsStore, useUserStore } from '../../../services/stores';
import VtHeader from '../../common/header';
import useStyle from './styles';

const Settings = () => {
  const styles = useStyle();
  const [isRefreshingDistricts, setIsRefreshingDistricts] = useState(false);
  const {
    data: {
      filter: {
        location: { name },
      },
    },
  } = useUserStore();
  const {
    districtsData: { states },
    setDistrictsData,
  } = useDistrictsStore();

  const userState = suggestDistricts(name, states)[0];

  const onPressRefreshStates = async () => {
    setIsRefreshingDistricts(true);
    const districtsResponse = await getDistrict(userState?.state_id);
    if (districtsResponse?.districts?.length > 0) {
      const newStatesData: StatesModel[] = JSON.parse(JSON.stringify(states));
      newStatesData.forEach(state => {
        if (state.state_id === userState?.state_id) {
          state.districts = districtsResponse.districts;
        }
      });
      setDistrictsData({ states: newStatesData });
      ToastAndroid.show(
        'Districts updated for ' + userState.state_name,
        ToastAndroid.SHORT,
      );
    } else {
      ToastAndroid.show(
        'Update failed, please try sometime later',
        ToastAndroid.SHORT,
      );
    }
    setIsRefreshingDistricts(false);
  };

  return (
    <SafeAreaView style={styles.parent}>
      <VtHeader title={translations.SETTINGS_SCREEN_TITLE} />
      {userState ? (
        <Pressable onPress={onPressRefreshStates} style={styles.refetchParent}>
          <View>
            <Text style={styles.refetchText}>
              {translations.SETTINGS_REFETCH_DISTRICTS}
            </Text>
            <Text style={styles.refetchStateText}>{userState.state_name}</Text>
          </View>
          <ActivityIndicator
            animating={isRefreshingDistricts}
            color={styles.refetchIconStyle.color}
            size={24}
          />
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
};

export default Settings;
