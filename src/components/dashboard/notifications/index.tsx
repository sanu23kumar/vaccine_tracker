import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import strings from '../../../assets/strings';
import { NotificationFilter } from '../../../services/models/filters';
import { useFilterStore } from '../../../services/stores';
import VtButton from '../../common/button';
import VtHeader from '../../common/header';
import HelperItem from './HelperItem';
import useStyle from './styles';

const Notifications = () => {
  const styles = useStyle();
  const { notificationsData, setNotificationsData } = useFilterStore();
  const onPressAddNotificationHelper = () => {};
  const renderItem = ({ item }: { item: NotificationFilter }) => {
    const onPressEdit = () => {};
    const onPressEnableDisable = () => {};
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
      <VtHeader title={strings.dashboard.notifications.header}>
        <Icon
          name="add"
          color={styles.iconStyle.color}
          size={28}
          style={styles.iconStyle}
        />
      </VtHeader>
      <VtButton
        title="Add notification helper"
        onPress={onPressAddNotificationHelper}
      />
      <FlatList
        data={notificationsData.notifications}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Notifications;
