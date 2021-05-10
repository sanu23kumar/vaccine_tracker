import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import strings from '../../../assets/strings';
import VtHeader from '../../common/header';
import useStyle from './styles';

const Notifications = () => {
  const styles = useStyle();
  return (
    <SafeAreaView>
      <VtHeader title={strings.dashboard.notifications.header} >
      <Icon
            name="add"
            color="white"
            size={28}
            style={styles.iconStyle}
          />
      </VtHeader>
      <View>
        <Text>
          You have no notifications yet
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
