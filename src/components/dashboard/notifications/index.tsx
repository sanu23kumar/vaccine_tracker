import React, { useRef, useState } from 'react';
import { Animated, SafeAreaView, View } from 'react-native';
import strings from '../../../assets/strings';
import {
  FILTER_KEYS,
  NotificationFilter,
} from '../../../services/models/filters';
import { useFilterStore } from '../../../services/stores';
import VtButton from '../../common/button';
import VtHeader from '../../common/header';
import HelperItem from './HelperItem';
import NewHelper, { HELPER_COMPONENT_SIZE } from './NewHelper';
import useStyle from './styles';

const Notifications = () => {
  const styles = useStyle();
  const { notificationsData, setNotificationsData } = useFilterStore();
  const filterAnim = useRef(new Animated.Value(0)).current;
  const [isFilterPressed, setIsFilterPressed] = useState(false);
  const onPressAddNotificationHelper = () => {
    Animated.spring(filterAnim, {
      toValue: isFilterPressed ? 0 : HELPER_COMPONENT_SIZE,
      useNativeDriver: true,
    }).start();

    setIsFilterPressed(!isFilterPressed);
  };
  const onSave = (notificationFilter: NotificationFilter) => {
    setNotificationsData({
      notifications: [notificationFilter, ...notificationsData.notifications],
    });
    onPressAddNotificationHelper();
  };

  const onDelete = (notificationFilter: NotificationFilter) => {
    setNotificationsData({
      notifications: notificationsData.notifications.filter(
        notification =>
          notification[FILTER_KEYS.NOTIFICATION_ID] !==
          notificationFilter[FILTER_KEYS.NOTIFICATION_ID],
      ),
    });
  };
  const renderItem = ({ item }: { item: NotificationFilter }) => {
    const onPressEdit = () => {};
    const onPressEnableDisable = () => {
      setNotificationsData({
        notifications: notificationsData.notifications.map(filter =>
          filter[FILTER_KEYS.NOTIFICATION_ID] ===
          item[FILTER_KEYS.NOTIFICATION_ID]
            ? {
                ...filter,
                enabled: !filter.enabled,
              }
            : filter,
        ),
      });
    };
    return (
      <HelperItem
        item={item}
        onPressEdit={onPressEdit}
        onPressEnableDisable={onPressEnableDisable}
      />
    );
  };
  return (
    <SafeAreaView style={styles.parent}>
      <VtHeader title={strings.dashboard.notifications.header} />
      <View style={styles.addParent}>
        <VtButton
          title={isFilterPressed ? 'Close' : 'Add notification helper'}
          onPress={onPressAddNotificationHelper}
        />
      </View>

      <View>
        <NewHelper
          onSave={onSave}
          onDelete={onDelete}
          filterAnim={filterAnim}
        />
      </View>

      <Animated.FlatList
        style={{
          opacity: filterAnim.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
          }),
          transform: [{ translateY: filterAnim }],
        }}
        data={notificationsData.notifications}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Notifications;
