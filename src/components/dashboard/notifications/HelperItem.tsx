import React from 'react';
import { Pressable, Text, View } from 'react-native';
import useVtTheme from '../../../assets/theme/useVtTheme';
import {
  FILTER_KEYS,
  NotificationFilter,
} from '../../../services/models/filters';
import VtSwitch from '../../common/switch';
import useStyle from './styles';

interface Props {
  item: NotificationFilter;
  onPressEdit: () => void;
  onPressEnableDisable: () => void;
}

const HelperItem = ({ item, onPressEdit, onPressEnableDisable }: Props) => {
  const styles = useStyle();
  const { colors } = useVtTheme();
  return (
    <View style={styles.helperItemParent}>
      <Pressable onPress={onPressEdit} style={styles.helperItemTextContent}>
        <Text style={styles.helperItemEdit}>EDIT</Text>
        <Text style={styles.helperItemTitle}>{item.notification_name}</Text>
      </Pressable>
      <View style={styles.helperSwitchParent}>
        <Text
          style={[
            styles.helperSwitchText,
            {
              color: item[FILTER_KEYS.ENABLED]
                ? colors.PRIMARY
                : colors.TEXT_DISABLED,
            },
          ]}>
          {item[FILTER_KEYS.ENABLED] ? 'ON' : 'OFF'}
        </Text>
        <VtSwitch
          enabled={item[FILTER_KEYS.ENABLED]}
          onPress={onPressEnableDisable}
        />
      </View>
    </View>
  );
};

export default HelperItem;
