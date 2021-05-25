import React from 'react';
import { SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import strings from '../../../assets/strings';
import VtHeader from '../../common/header';
import useStyle from './styles';

const Settings = () => {
  const styles = useStyle();
  return (
    <SafeAreaView style={styles.parent}>
      <VtHeader title={strings.dashboard.settings.header}>
        <Icon
          name="add"
          color={styles.iconStyle.color}
          size={28}
          style={styles.iconStyle}
        />
      </VtHeader>
    </SafeAreaView>
  );
};

export default Settings;