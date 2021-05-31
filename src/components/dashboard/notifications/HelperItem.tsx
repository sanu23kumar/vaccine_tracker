import React from 'react';
import { Text, View } from 'react-native';
import {
  FILTER_KEYS,
  NotificationFilter,
} from '../../../services/models/filters';
import useStyle from './styles';

interface Props {
  item: NotificationFilter;
  onPressEdit: () => void;
  onPressEnableDisable: () => void;
}

const HelperItem = ({ item, onPressEdit, onPressEnableDisable }: Props) => {
  const styles = useStyle();
  return (
    <View>
      <Text>{item[FILTER_KEYS.ENABLED] ? 'Is enabled' : 'Is disabled'}</Text>
      <Text>{item[FILTER_KEYS.NAME]}</Text>
    </View>
  );
};

export default HelperItem;
