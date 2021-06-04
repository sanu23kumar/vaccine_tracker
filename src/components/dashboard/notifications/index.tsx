import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, ToastAndroid, View } from 'react-native';
import translations from '../../../assets/translations';
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

const Notifications = ({ route }) => {
  const createHelper = route?.params?.createHelper;
  const styles = useStyle();
  const { notificationsData, setNotificationsData } = useFilterStore();
  const filterAnim = useRef(new Animated.Value(0)).current;
  const [isFilterPressed, setIsFilterPressed] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter | undefined>();
  const onPressAddNotificationHelper = (value = undefined) => {
    const open = value?.open;
    let toValue = 0;
    if (open) {
      console.log('Open is defined', open);
      toValue = !open ? 0 : HELPER_COMPONENT_SIZE;
    } else {
      toValue = isFilterPressed ? 0 : HELPER_COMPONENT_SIZE;
    }
    Animated.spring(filterAnim, {
      toValue,
      useNativeDriver: true,
    }).start();

    setIsFilterPressed(open ?? !isFilterPressed);
  };
  useEffect(() => {
    if (createHelper) {
      console.log('Create helper updated');
      onPressAddNotificationHelper({ open: true });
    }
  }, [createHelper]);
  const onSave = (notificationFilter: NotificationFilter) => {
    onPressAddNotificationHelper();
    if (filter) {
      setNotificationsData({
        notifications: notificationsData.notifications.map(notification =>
          notification[FILTER_KEYS.NOTIFICATION_ID] ===
          notificationFilter[FILTER_KEYS.NOTIFICATION_ID]
            ? { ...notification, ...notificationFilter }
            : notification,
        ),
      });
      setFilter(undefined);
    } else {
      setNotificationsData({
        notifications: [notificationFilter, ...notificationsData.notifications],
      });
    }
  };

  const onDelete = (notificationFilter: NotificationFilter) => {
    ToastAndroid.show(
      'Notification deleted successfully ' +
        notificationFilter.notification_name,
      ToastAndroid.SHORT,
    );
    onPressAddNotificationHelper();
    setNotificationsData({
      notifications: notificationsData.notifications.filter(
        notification =>
          notification[FILTER_KEYS.NOTIFICATION_ID] !==
          notificationFilter[FILTER_KEYS.NOTIFICATION_ID],
      ),
    });
  };
  const renderItem = ({ item }: { item: NotificationFilter }) => {
    const onPressEdit = () => {
      setFilter(item);
      onPressAddNotificationHelper();
    };
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
      <VtHeader title={translations.NOTIFICATION_SCREEN_TITLE} />
      <View style={styles.addParent}>
        <VtButton
          title={
            isFilterPressed
              ? translations.NOTIFICATIONS_CLOSE
              : translations.NOTIFICATIONS_ADD
          }
          onPress={onPressAddNotificationHelper}
        />
      </View>

      <View>
        <NewHelper
          onSave={onSave}
          onDelete={onDelete}
          filterAnim={filterAnim}
          filter={filter}
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
