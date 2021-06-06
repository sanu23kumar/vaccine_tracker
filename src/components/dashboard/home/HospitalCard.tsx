import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import strings from '../../../assets/strings';
import useVtTheme from '../../../assets/theme/useVtTheme';
import translations from '../../../assets/translations';
import { Center, Session } from '../../../services/models/centers';
import FullBannerAd from '../../common/ad/banner';
import VtButton from '../../common/button';
import useStyle from './styles';

const HospitalCard = ({
  hospital,
  session,
  showAd,
}: {
  hospital: Center;
  session: Session;
  showAd: boolean;
}) => {
  const styles = useStyle();
  const { colors } = useVtTheme();
  const { navigate } = useNavigation();

  const bookable = session.available_capacity > 0;

  const onPress = () => {
    if (bookable) {
      Linking.openURL('https://selfregistration.cowin.gov.in/');
    } else {
      navigate(strings.dashboard.notifications.NAME, {
        createHelper: new Date(),
      });
    }
  };
  return (
    <View style={[styles.hospitalCard, { marginBottom: showAd ? 20 : 40 }]}>
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
            { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT },
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
              {translations.HOME_SCREEN_AVAILABLE_TEXT}
            </Text>
            <Text
              style={styles.hospitalMinAge}>{`${session.min_age_limit}+`}</Text>
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.hospitalVaccine,
              { color: !bookable ? colors.TEXT_DISABLED : colors.SECONDARY },
            ]}>
            {
              translations[
                'FILTER_VACCINE_' +
                  session.vaccine.toLocaleUpperCase() +
                  '_TEXT'
              ]
            }
          </Text>
        </View>
      </View>
      <VtButton
        color={bookable ? colors.PRIMARY : colors.SECONDARY}
        title={
          bookable
            ? translations.BOOK_NOW_TEMPLATE.replace(
                '$',
                hospital.fee_type.toLowerCase().includes('free')
                  ? translations.FILTER_COST_FREE_TEXT
                  : '₹ ' + (hospital.vaccine_fees[0]?.fee ?? 0),
              )
            : translations.HOME_SCREEN_NOTIFY_ME_TEXT
        }
        onPress={onPress}
      />
      {showAd ? <FullBannerAd style={styles.hospitalAd} /> : null}
    </View>
  );
};

export default HospitalCard;
