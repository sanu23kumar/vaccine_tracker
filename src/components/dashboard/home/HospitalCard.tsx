import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import strings from '../../../assets/strings';
import useVtTheme from '../../../assets/theme/useVtTheme';
import { Center, Session } from '../../../services/models/centers';
import useStyle from './styles';

const HospitalCard = ({
  hospital,
  session,
}: {
  hospital: Center;
  session: Session;
}) => {
  const styles = useStyle();
  const { colors } = useVtTheme();
  const { navigate } = useNavigation();

  const bookable = session.available_capacity > 0;

  const onPress = () => {
    if (bookable) {
      Linking.openURL('https://selfregistration.cowin.gov.in/');
    } else {
      navigate(strings.dashboard.notifications.NAME);
    }
  };
  return (
    <View style={styles.hospitalCard}>
      <View style={styles.hospitalContent}>
        <Text
          style={[
            styles.hospitalName,
            { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT },
          ]}>
          {hospital.name}
        </Text>
        <Text
          style={[
            styles.hospitalAddress,
            { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT_LIGHT },
          ]}>
          {hospital.address}
        </Text>
        <View style={styles.hospitalVaccineDetailsParent}>
          <View style={styles.hospitalAgeParent}>
            <Text
              style={[
                styles.hospitalAvailable,
                { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT },
              ]}>
              {session.available_capacity}
            </Text>
            <Text
              style={[
                styles.hospitalAvailableText,
                { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT },
              ]}>
              available
            </Text>
            <Text
              style={styles.hospitalMinAge}>{`${session.min_age_limit}+`}</Text>
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.hospitalVaccine,
              { color: !bookable ? colors.TEXT_DISABLED : colors.TERTIARY },
            ]}>
            {session.vaccine}
          </Text>
        </View>
        <View style={styles.hospitalActionParent}>
          <Pressable
            onPress={onPress}
            style={[
              styles.actionParent,
              { borderColor: bookable ? colors.PRIMARY : colors.SECONDARY },
            ]}>
            <Text
              style={[
                styles.actionText,
                { color: bookable ? colors.PRIMARY : colors.SECONDARY },
              ]}>
              {bookable
                ? `Book now for ${
                    hospital.fee_type.toLowerCase().includes('free')
                      ? 'free'
                      : (hospital.vaccine_fees[0]?.fee ?? 0) + '₹'
                  }`
                : 'Notify Me'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HospitalCard;
